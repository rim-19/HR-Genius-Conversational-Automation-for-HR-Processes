import express from "express";
import {
  aiController,
  aiControllerStream,
  getAIHistory,
  clearAIHistory,
} from "../controllers/aiController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/message", authenticate, aiController);
router.post("/message/stream", authenticate, aiControllerStream);

// Chat history (used by the frontend on load / clear)
router.get("/history", authenticate, getAIHistory);
router.delete("/history", authenticate, clearAIHistory);

export default router;
