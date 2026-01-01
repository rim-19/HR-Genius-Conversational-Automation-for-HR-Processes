// backend/src/controllers/aiController.ts

import { Request, Response } from "express";
import { extractHRIntent } from "../ai/intentChain";
import { planActions } from "../actions/planner";
import { executeActions } from "../actions/executor";
import { ExecutionContext } from "../actions/context";

export async function aiController(req: Request, res: Response) {
  console.log("🟢 AI CONTROLLER — START");

  try {
    // 0️⃣ Input validation
    if (!req.body?.message) {
      throw new Error("Missing message in request body");
    }

    console.log("🟢 STEP 0 — MESSAGE:", req.body.message);

    // 1️⃣ Intent extraction
    const intent = await extractHRIntent(req.body.message);
    console.log("🟢 STEP 1 — INTENT EXTRACTED:", intent);

    // 2️⃣ Auth context
    if (!req.user) {
      throw new Error("User missing in request (auth middleware issue)");
    }
const today = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

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
    };

    console.log("🟢 STEP 2 — CONTEXT CREATED:", ctx);

    // 3️⃣ Planning
    const actions = planActions(intent);
    console.log("🟢 STEP 3 — ACTION PLAN:", actions);

    // 4️⃣ Execution
    const finalCtx = await executeActions(actions, ctx);
    console.log("🟢 STEP 4 — EXECUTION COMPLETE:", finalCtx);

    return res.status(200).json({
      success: true,
      intent,
      actions,
      result: finalCtx,
    });

  } catch (err: any) {
    console.error("🔴 AI PIPELINE FAILURE");

    console.error({
      message: err.message,
      stage: err.stage || "unknown",
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      errorStage: err.stage || "unknown",
      error: err.message,
    });
  }
}
