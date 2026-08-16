import { Router } from "express";
import { listTemplates, updateTemplate } from "../controllers/templateController";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, authorize(Role.ADMIN, Role.HR), listTemplates);
router.put("/:id", authenticate, authorize(Role.ADMIN, Role.HR), updateTemplate);

export default router;
