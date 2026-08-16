import { Router } from "express";
import {
  listNotifications,
  markRead,
  markAllRead,
} from "../controllers/notificationController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticate, listNotifications);
router.patch("/read-all", authenticate, markAllRead);
router.patch("/:id/read", authenticate, markRead);

export default router;
