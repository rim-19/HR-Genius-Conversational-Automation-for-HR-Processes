import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../prisma/client";

// GET /api/me/employee — the logged-in user's own employee record + documents + leave.
export async function getMyEmployee(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;

  const employee = await prisma.employee.findFirst({
    where: { userId },
    include: {
      documents: { orderBy: { createdAt: "desc" } },
      leaveRequests: { orderBy: { createdAt: "desc" } },
      manager: { select: { id: true, name: true, email: true } },
    },
  });

  if (!employee) {
    return res
      .status(404)
      .json({ message: "No employee record is linked to your account. Please contact HR." });
  }

  return res.json(employee);
}
