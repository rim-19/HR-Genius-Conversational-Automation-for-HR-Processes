import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../prisma/client";

// GET /api/audit — paginated action log (ADMIN)
export async function listAudit(req: AuthRequest, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.actionLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { name: true, role: true, email: true } } },
    }),
    prisma.actionLog.count(),
  ]);

  return res.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
}

// GET /api/employees/:id/export — GDPR export of one employee's data (ADMIN/HR)
export async function exportEmployee(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      documents: true,
      leaveRequests: true,
      manager: { select: { name: true, email: true } },
    },
  });

  if (!employee) return res.status(404).json({ message: "Employee not found" });

  res.setHeader("Content-Disposition", `attachment; filename="employee-${id}-export.json"`);
  return res.json({ exportedAt: new Date().toISOString(), employee });
}
