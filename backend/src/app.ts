// backend/src/app.ts
// Builds and exports the configured Express app (no listen) so it can be
// reused by the server entrypoint AND by integration tests (Supertest).

import "./config/loadEnv";

import express from "express";
import path from "path";
import axios from "axios";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";

// Routes
import userRoutes from "./routes/userRoutes";
import documentRoutes from "./routes/documentRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import aiRoutes from "./routes/aiRoutes";
import leaveRoutes from "./routes/leaveRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import templateRoutes from "./routes/templateRoutes";
import auditRoutes from "./routes/auditRoutes";
import { getStats } from "./controllers/statsController";
import { getActivity } from "./controllers/activityController";
import { authenticate } from "./middlewares/authMiddleware";

// Error handling + logging
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./config/logger";

const app = express();

// -----------------------------------------------------------
// Security & infrastructure middleware
// -----------------------------------------------------------
app.use(helmet());

// CORS restricted to configured origin(s); falls back to open in dev.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : "*";
app.use(cors({ origin: corsOrigin }));

app.use(express.json());
app.use(pinoHttp({ logger }));

// Rate limiters — tighter on auth (brute force) and AI (cost/abuse).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later." },
});
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "You're sending requests too quickly — please slow down." },
});
if (process.env.NODE_ENV !== "test") {
  app.use("/api/auth", authLimiter);
  app.use("/api/ai", aiLimiter);
}

// -----------------------------------------------------------
// Static files — serve generated PDFs
// -----------------------------------------------------------
app.use("/docs", express.static(path.join(__dirname, "..", "generated")));

// -----------------------------------------------------------
// API routes
// -----------------------------------------------------------
app.use("/api", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/audit", auditRoutes);
app.get("/api/stats", authenticate, getStats);
app.get("/api/activity", authenticate, getActivity);

// -----------------------------------------------------------
// Test route to trigger the external n8n workflow
// (kept before the error handler so it is a normal route)
// -----------------------------------------------------------
app.get("/test-n8n", async (req, res) => {
  try {
    const payload = {
      employee: { id: 99, name: "Test User", email: "youssrarimyassmine@gmail.com" },
      documentType: "promotion",
      data: { promotionDate: "2025-01-01", newPosition: "Team Lead" },
      pdfUrl: `http://${req.hostname}:${process.env.PORT || 5000}/docs/test.pdf`,
    };

    const webhookUrl =
      process.env.N8N_WEBHOOK_URL || "http://127.0.0.1:5678/webhook/send-document-pdf";
    const response = await axios.post(webhookUrl, payload);

    return res.status(200).json({
      success: true,
      message: "n8n workflow triggered successfully",
      n8nResponse: response.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error?.response?.data || "Error in workflow",
    });
  }
});

// -----------------------------------------------------------
// Global error handler — MUST be last
// -----------------------------------------------------------
app.use(errorHandler);

export default app;
