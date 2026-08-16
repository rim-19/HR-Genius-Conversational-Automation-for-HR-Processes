import { Request, Response } from "express";
import { generateAIResponse, streamAIResponse } from "../ai/responseGenerator";
import { runAssistant, saveMessage, conversationalMessageFor } from "../ai/pipeline";
import { prisma } from "../prisma/client";
import { AppError } from "../utils/AppError";

function structuredData(ctx: any) {
  return {
    employee: ctx.employee,
    employees: ctx.employees,
    documents: ctx.documents,
    pdfUrl: ctx.pdfUrl,
  };
}

// -----------------------------------------------------------
// POST /api/ai/message  — buffered (JSON) reply
// -----------------------------------------------------------
export async function aiController(req: Request, res: Response) {
  try {
    if (!req.body?.message) {
      throw AppError.validation("Missing message in request body", "aiController");
    }
    if (!req.user) {
      throw AppError.unauthorized("User missing in request (auth middleware issue)", "aiController");
    }

    const user = { id: req.user.userId, role: req.user.role, email: req.user.email };
    const outcome = await runAssistant(user, String(req.body.message));

    if (outcome.kind === "reply") {
      return res.status(200).json({ success: true, message: outcome.message, data: {} });
    }

    const aiMessage = await generateAIResponse(outcome.ctx);
    await saveMessage(user.id, "ai", aiMessage);
    return res.status(200).json({
      success: true,
      message: aiMessage,
      data: structuredData(outcome.ctx),
    });
  } catch (err: any) {
    const friendly = conversationalMessageFor(err);
    if (friendly) {
      if (req.user) await saveMessage(req.user.userId, "ai", friendly);
      return res.status(200).json({ success: true, message: friendly, data: {} });
    }
    if (!err.statusCode) err.stage = err.stage ?? "aiController";
    throw err;
  }
}

// -----------------------------------------------------------
// POST /api/ai/message/stream  — Server-Sent Events (token streaming)
// Emits `token` events, then a final `done` event with { message, data }.
// -----------------------------------------------------------
export async function aiControllerStream(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  (res as any).flushHeaders?.();

  const send = (event: string, data: any) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    if (!req.body?.message) {
      send("error", { message: "Missing message in request body" });
      return res.end();
    }
    if (!req.user) {
      send("error", { message: "Unauthorized" });
      return res.end();
    }

    const user = { id: req.user.userId, role: req.user.role, email: req.user.email };
    const outcome = await runAssistant(user, String(req.body.message));

    // Clarifications / confirmations / cancellations are short — send as one event.
    if (outcome.kind === "reply") {
      send("done", { message: outcome.message, data: {} });
      return res.end();
    }

    // Stream the final response token-by-token.
    let full = "";
    try {
      for await (const token of streamAIResponse(outcome.ctx)) {
        full += token;
        send("token", { token });
      }
    } catch (streamErr) {
      // Streaming failed mid-way — fall back to a buffered response.
      const friendly = conversationalMessageFor(streamErr);
      full = friendly || (await generateAIResponse(outcome.ctx).catch(() => "")) ||
        "I've processed your request.";
    }

    await saveMessage(user.id, "ai", full);
    send("done", { message: full, data: structuredData(outcome.ctx) });
    return res.end();
  } catch (err: any) {
    const friendly = conversationalMessageFor(err);
    const message = friendly || "Sorry, something went wrong processing that.";
    if (req.user) await saveMessage(req.user.userId, "ai", message);
    send("done", { message, data: {} });
    return res.end();
  }
}

// -----------------------------------------------------------
// GET /api/ai/history — persisted chat transcript (oldest first)
// -----------------------------------------------------------
export async function getAIHistory(req: Request, res: Response) {
  if (!req.user) {
    throw AppError.unauthorized("User missing in request", "getAIHistory");
  }
  const messages = await prisma.chatMessage.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true, createdAt: true },
  });
  return res.json(messages);
}

// -----------------------------------------------------------
// DELETE /api/ai/history — clear transcript + conversational memory
// -----------------------------------------------------------
export async function clearAIHistory(req: Request, res: Response) {
  if (!req.user) {
    throw AppError.unauthorized("User missing in request", "clearAIHistory");
  }
  const userId = req.user.userId;
  await prisma.chatMessage.deleteMany({ where: { userId } });
  await prisma.conversationMemory.deleteMany({ where: { userId } });
  return res.json({ success: true });
}
