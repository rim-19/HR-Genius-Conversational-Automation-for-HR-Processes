import { prisma } from "../prisma/client";
import axios from "axios";
import { logger } from "../config/logger";

/** Create an in-app notification. Best-effort — never throws. */
export async function createNotification(
  userId: number,
  type: "document" | "leave" | "employee" | "system",
  message: string
) {
  try {
    await prisma.notification.create({ data: { userId, type, message } });
  } catch (e) {
    logger.warn({ err: e }, "createNotification failed");
  }
}

/**
 * Send an email via the external n8n workflow (best-effort).
 * We do NOT define n8n workflows here — this just POSTs to the configured webhook.
 */
export async function sendEmailViaN8n(payload: Record<string, any>) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;
  try {
    await axios.post(url, payload);
  } catch (e) {
    logger.warn("n8n email webhook failed (is n8n running?)");
  }
}
