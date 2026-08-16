import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../prisma/client";

// GET /api/notifications — recent notifications + unread count for the current user
export async function listNotifications(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const [items, unread] = await Promise.all([
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);
  return res.json({ items, unread });
}

// PATCH /api/notifications/:id/read
export async function markRead(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const id = Number(req.params.id);
  await prisma.notification.updateMany({ where: { id, userId }, data: { read: true } });
  return res.json({ success: true });
}

// PATCH /api/notifications/read-all
export async function markAllRead(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  return res.json({ success: true });
}
