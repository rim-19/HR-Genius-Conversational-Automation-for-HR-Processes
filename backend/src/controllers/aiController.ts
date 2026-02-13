import { Request, Response } from "express";
import { extractHRIntent } from "../ai/intentChain";
import { planActions } from "../actions/planner";
import { executeActions } from "../actions/executor";
import { ExecutionContext } from "../actions/context";
import { loadMemory, saveMemory } from "../ai/memory";
import { generateAIResponse } from "../ai/responseGenerator";
import { AppError } from "../utils/AppError";

export async function aiController(req: Request, res: Response) {
  try {
    // 0️⃣ Validate input
    if (!req.body?.message) {
      throw AppError.validation("Missing message in request body", "aiController");
    }

    if (!req.user) {
      throw AppError.unauthorized("User missing in request (auth middleware issue)", "aiController");
    }

    const userId = req.user.userId;

    // 1️⃣ Load backend conversational memory
    const memory = await loadMemory(userId);

    // 2️⃣ Extract intent via LangChain
    const intent = await extractHRIntent(req.body.message);

    // 3️⃣ Enrich intent using backend memory (ONLY if not a general inquiry)
    // This prevents simple greetings from being confused with previous HR tasks
    if (intent.intent !== "general_inquiry") {
      if (!intent.employeeName && memory.lastEmployee) {
        intent.employeeName = memory.lastEmployee.name;
      }
      if (!intent.documentType && memory.lastDocumentType) {
        intent.documentType = memory.lastDocumentType;
      }
    }

    // 4️⃣ Build execution context
    const ctx: ExecutionContext = {
      intent,
      user: {
        id: req.user.userId,
        role: req.user.role,
        email: req.user.email,
      },
      system: {
        today: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      },
      userMessage: req.body.message,
      memory,
    };

    // 5️⃣ Plan actions
    const actions = planActions(intent, req.user.role);


    // 6️⃣ Execute actions
    const finalCtx = await executeActions(actions, ctx);

    // 7️⃣ Generate AI response based on execution results
    const aiMessage = await generateAIResponse(finalCtx);

    // 8️⃣ Update backend memory
    await saveMemory(userId, {
      lastEmployee: finalCtx.employee
        ? {
          id: finalCtx.employee.id,
          name: finalCtx.employee.name,
          email: finalCtx.employee.email,
        }
        : memory.lastEmployee,
      lastDocumentType: intent.documentType ?? memory.lastDocumentType,
      lastIntent: intent.intent,
    });

    // 9️⃣ Response with AI message and structured data
    return res.status(200).json({
      success: true,
      message: aiMessage,
      data: {
        employee: finalCtx.employee,
        employees: finalCtx.employees,
        documents: finalCtx.documents,
        pdfUrl: finalCtx.pdfUrl,
      },
    });

  } catch (err: any) {
    if (!err.statusCode) {
      err.stage = err.stage ?? "aiController";
    }
    throw err;
  }
}
