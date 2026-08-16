import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../prisma/client";
import { AppError } from "../utils/AppError";

// GET /api/templates
export async function listTemplates(_req: AuthRequest, res: Response) {
  const templates = await prisma.documentTemplate.findMany({ orderBy: { type: "asc" } });
  return res.json(templates);
}

// PUT /api/templates/:id — edit name/guidance (ADMIN/HR)
export async function updateTemplate(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { name, guidance } = req.body;

  const data: any = { createdById: req.user!.userId };
  if (name !== undefined) data.name = String(name);
  if (guidance !== undefined) data.guidance = String(guidance);

  if (data.name === undefined && data.guidance === undefined) {
    throw AppError.validation("Nothing to update — provide name and/or guidance", "updateTemplate");
  }

  const template = await prisma.documentTemplate.update({ where: { id }, data });
  return res.json(template);
}
