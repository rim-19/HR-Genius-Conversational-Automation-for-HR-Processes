import { Request, Response } from "express";
import { extractHRIntent } from "../ai/intentChain";
import { planActions } from "../actions/planner";
import { executeActions } from "../actions/executor";
import { ExecutionContext } from "../actions/context";

export async function aiController(req: Request, res: Response) {
  try {
    console.log("▶ AI CONTROLLER START");

    // 1️⃣ Intent
    const intent = await extractHRIntent(req.body.message);
    console.log("✔ INTENT:", intent);

    // 2️⃣ Context
    if (!req.user) throw new Error("User missing in request");

    const ctx: ExecutionContext = {
      intent,
      user: {
        id: req.user.userId,
        role: req.user.role,
        email: req.user.email,
      },
    };

    console.log("✔ CONTEXT:", ctx);

    // 3️⃣ Plan
    const actions = planActions(intent);
    console.log("✔ ACTIONS PLAN:", actions);

    // 4️⃣ Execute
    const finalCtx = await executeActions(actions, ctx);
    console.log("✔ FINAL CONTEXT:", finalCtx);

    return res.json({
      success: true,
      intent,
      actions,
      result: finalCtx,
    });
  } catch (err: any) {
    console.error("❌ AI ERROR:", err);
    return res.status(500).json({
      error: err.message || "AI processing failed",
    });
  }
}
