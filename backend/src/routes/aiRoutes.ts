import express from "express";
import { aiController } from "../controllers/aiController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/message",
  authenticate,
  aiController
);

export default router;
