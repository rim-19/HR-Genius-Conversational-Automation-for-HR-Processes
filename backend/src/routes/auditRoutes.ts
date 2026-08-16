import { Router } from "express";
import { listAudit, exportEmployee } from "../controllers/auditController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, authorize(Role.ADMIN), listAudit);
router.get(
  "/employee/:id/export",
  authenticate,
  authorize(Role.ADMIN, Role.HR),
  exportEmployee
);

export default router;
