import { Router } from "express";
import { createLeave, listLeave, reviewLeave } from "../controllers/leaveController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, listLeave);
router.post("/", authenticate, createLeave);
router.patch("/:id", authenticate, authorize(Role.ADMIN, Role.HR, Role.MANAGER), reviewLeave);

export default router;
