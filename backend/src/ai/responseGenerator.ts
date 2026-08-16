import { llm } from "./llm";
import { ExecutionContext } from "../actions/context";

// Build the response prompt from verified execution results (shared by the
// buffered and streaming generators).
function buildResponsePrompt(ctx: ExecutionContext): string {
  const contextSummary = {
    intent: ctx.intent,
    employee: ctx.employee,
    employees: ctx.employees || [],
    documents: ctx.documents || [],
    pdfUrl: ctx.pdfUrl,
    employeeDeleted: ctx.employeeDeleted,
    knowledge: ctx.knowledge || [],
    analytics: ctx.analytics || null,
    system: ctx.system,
    memory: ctx.memory
  };

  return `
You are HR-Genius, a smart and friendly AI HR Assistant. 

GOAL:
Respond to the USER MESSAGE naturally using the EXECUTION CONTEXT and CONVERSATIONAL MEMORY provided.

USER MESSAGE:
"${ctx.userMessage}"

EXECUTION CONTEXT (What just happened):
${JSON.stringify(contextSummary, null, 2)}

CONVERSATIONAL RULES:
1. Speak like a person, not a database reporter.
2. Acknowledge the user's tone. If they say "hi", say "hi" back!
3. USE MEMORY: If the user uses pronouns (him, her, it, them) or asks "did you do it?", look at the "memory" field in the context to see the last employee or document discussed.
4. If the user asked a question and nothing was found in the context (and nothing is in memory), explain why or ask for more details naturally.
5. DO NOT say "I didn't find anything" in a robotic way.
6. If an action was successful, confirm it smoothly.
7. If a document was generated (pdfUrl exists), tell them it's ready. USE a clean markdown link with descriptive text (e.g., [View Promotion Letter]) and NEVER show the raw technical URL string in the text.
8. POLICY QUESTIONS: If the "knowledge" field is non-empty, answer the user's question USING ONLY that handbook content — do not invent policy details. Be specific (quote the numbers/rules). If the knowledge does not cover the question, say you don't have that policy on file. End with a short source note like "(Source: Leave & Time-Off Policy)".
9. ANALYTICS: If the "analytics" field is present, present the rows clearly (a compact list or small table), highlighting the group and value. Mention whether the figure is an average salary or a headcount.

Generate a natural, helpful, and concise response:`;
}

const FAILSAFE =
  "I've processed your request, but I'm having a bit of trouble articulating the response. Is there anything specific you'd like to check?";

export async function generateAIResponse(ctx: ExecutionContext): Promise<string> {
  try {
    const response = await llm.invoke(buildResponsePrompt(ctx));
    return response.content.toString().trim();
  } catch (error) {
    console.error('AI Response Generation Failed:', error);
    return FAILSAFE;
  }
}

/**
 * Stream the final response token-by-token. Yields text fragments as they
 * arrive. On failure the caller falls back to a buffered response.
 */
export async function* streamAIResponse(ctx: ExecutionContext): AsyncGenerator<string> {
  const stream = await llm.stream(buildResponsePrompt(ctx));
  for await (const chunk of stream) {
    const text = (chunk as any)?.content?.toString?.() ?? "";
    if (text) yield text;
  }
}
