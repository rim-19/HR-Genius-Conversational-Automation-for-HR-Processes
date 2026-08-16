// Shared assistant orchestration, reused by the JSON controller and the SSE
// (streaming) controller. Runs: persist → memory → confirmation → intent →
// clarification → confirmation gate → plan → execute. Returns either an early
// "reply" (a ready assistant message) or a "result" (ctx ready for the final,
// possibly streamed, response).

import { extractHRIntent } from "./intentChain";
import { planActions } from "../actions/planner";
import { executeActions } from "../actions/executor";
import { ExecutionContext } from "../actions/context";
import { loadMemory, saveMemory } from "./memory";
import {
  getMissingInfo,
  buildClarificationQuestion,
  mergeIntents,
  isAffirmative,
  isNegative,
  requiresConfirmation,
  buildConfirmationQuestion,
} from "./clarify";
import { prisma } from "../prisma/client";

export interface AssistantUser {
  id: number;
  role: string;
  email?: string;
}

export type AssistantOutcome =
  | { kind: "reply"; message: string } // clarification / confirmation / cancellation
  | { kind: "result"; ctx: ExecutionContext };

// Persist a chat turn. Never let a history-write failure break the actual reply.
export async function saveMessage(userId: number, role: "user" | "ai", content: string) {
  try {
    await prisma.chatMessage.create({ data: { userId, role, content } });
  } catch {
    /* non-fatal: history persistence is best-effort */
  }
}

/**
 * Map an error thrown by the pipeline to a user-facing assistant message,
 * or null if it should propagate as a real error.
 */
export function conversationalMessageFor(err: any): string | null {
  if (err?.isConversational) return err.message;
  const msg = String(err?.message || "");
  if (err?.status === 429 || /\b429\b|Too Many Requests|quota|rate limit/i.test(msg)) {
    return "I'm briefly over capacity right now — please try that again in a few seconds.";
  }
  return null;
}

export async function runAssistant(
  user: AssistantUser,
  rawMessage: string
): Promise<AssistantOutcome> {
  const userId = user.id;

  await saveMessage(userId, "user", rawMessage);

  const memory = await loadMemory(userId);

  let intent: any;
  let confirmedProceed = false;

  // Confirmation reply — handle a pending destructive action before any LLM call.
  if (memory.pendingConfirmation) {
    if (isAffirmative(rawMessage)) {
      intent = memory.pendingConfirmation.intent;
      confirmedProceed = true;
    } else if (isNegative(rawMessage)) {
      await saveMemory(userId, { ...memory, pendingConfirmation: undefined });
      const cancelled = "No problem — I've cancelled that.";
      await saveMessage(userId, "ai", cancelled);
      return { kind: "reply", message: cancelled };
    } else {
      memory.pendingConfirmation = undefined; // new request → drop stale confirmation
    }
  }

  if (!confirmedProceed) {
    intent = await extractHRIntent(rawMessage, memory.pendingIntent || null);

    if (memory.pendingIntent) {
      intent = mergeIntents(memory.pendingIntent, intent);
    }

    // Pronoun enrichment — only for intents acting on an EXISTING employee.
    if (["update_employee", "delete_employee", "generate_document"].includes(intent.intent)) {
      if (!intent.employeeName && memory.lastEmployee) {
        intent.employeeName = memory.lastEmployee.name;
      }
    }
    if (intent.intent === "generate_document" && !intent.documentType && memory.lastDocumentType) {
      intent.documentType = memory.lastDocumentType;
    }

    // Clarification — ask for missing required details instead of guessing.
    const missing = getMissingInfo(intent);
    if (missing.length > 0) {
      await saveMemory(userId, {
        ...memory,
        pendingIntent: intent,
        pendingConfirmation: undefined,
        lastIntent: intent.intent,
      });
      const question = buildClarificationQuestion(intent, missing);
      await saveMessage(userId, "ai", question);
      return { kind: "reply", message: question };
    }

    // Confirmation gate — destructive actions must be confirmed first.
    if (requiresConfirmation(intent)) {
      await saveMemory(userId, {
        ...memory,
        pendingIntent: undefined,
        pendingConfirmation: { intent },
        lastIntent: intent.intent,
      });
      const question = buildConfirmationQuestion(intent);
      await saveMessage(userId, "ai", question);
      return { kind: "reply", message: question };
    }
  }

  // Build execution context, plan, execute.
  const ctx: ExecutionContext = {
    intent,
    user: { id: user.id, role: user.role, email: user.email },
    system: { today: new Date().toISOString().split("T")[0] },
    userMessage: rawMessage,
    memory,
  };

  const actions = planActions(intent, user.role as any);
  const finalCtx = await executeActions(actions, ctx);

  // Persist resolved state (clears any pending request/confirmation).
  await saveMemory(userId, {
    lastEmployee: finalCtx.employee
      ? { id: finalCtx.employee.id, name: finalCtx.employee.name, email: finalCtx.employee.email }
      : memory.lastEmployee,
    lastDocumentType: intent.documentType ?? memory.lastDocumentType,
    lastIntent: intent.intent,
  });

  return { kind: "result", ctx: finalCtx };
}
