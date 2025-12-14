import express from "express";
import { handleHRMessage } from "../controllers/aiController";

const router = express.Router();
router.post("/message", handleHRMessage);
export default router;
