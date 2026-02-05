// backend/src/server.ts

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import cors from 'cors';

// Routes
import userRoutes from './routes/userRoutes';
import documentRoutes from './routes/documentRoutes';
import employeeRoutes from './routes/employeeRoutes';
import aiRoutes from "./routes/aiRoutes";
import { getStats } from './controllers/statsController';
import { getActivity } from './controllers/activityController';
import { authenticate } from './middlewares/authMiddleware';

// Error handling
import { errorHandler } from './middlewares/errorHandler';


dotenv.config();

const app = express();

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// -----------------------------------------------------------
// 1️⃣ STATIC FILES — Serve PDFs from /generated
// -----------------------------------------------------------
// Serve generated PDFs
app.use(
  "/docs",
  express.static(path.join(__dirname, "..", "generated"))
);


// -----------------------------------------------------------
// 2️⃣ API ROUTES
// -----------------------------------------------------------
app.use('/api', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/employees', employeeRoutes);
app.use("/api/ai", aiRoutes);
app.get('/api/stats', authenticate, getStats);
app.get('/api/activity', authenticate, getActivity);

// -----------------------------------------------------------
// 3️⃣ GLOBAL ERROR HANDLER - Must be last
// -----------------------------------------------------------
app.use(errorHandler);


// -----------------------------------------------------------
// 3️⃣ TEST ROUTE TO TRIGGER N8N WORKFLOW
// -----------------------------------------------------------
app.get('/test-n8n', async (req, res) => {
  try {
    const payload = {
      employee: {
        id: 99,
        name: "Test User",
        email: "youssrarimyassmine@gmail.com",
      },
      documentType: "promotion",
      data: {
        promotionDate: "2025-01-01",
        newPosition: "Team Lead",
      },
      // IMPORTANT → PDF served by your backend
      pdfUrl: `http://${req.hostname}:${process.env.PORT || 5000}/docs/test.pdf`
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL || "http://127.0.0.1:5678/webhook/send-document-pdf";

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
// 4️⃣ START SERVER — use 0.0.0.0 to be accessible
// -----------------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
