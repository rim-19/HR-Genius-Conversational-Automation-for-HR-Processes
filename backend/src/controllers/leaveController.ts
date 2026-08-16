import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../prisma/client";
import { AppError } from "../utils/AppError";
import { createNotification, sendEmailViaN8n } from "../utils/notify";
import { Role } from "@prisma/client";

function daysInclusive(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

async function myEmployee(userId: number) {
  return prisma.employee.findFirst({ where: { userId } });
}

// POST /api/leave — create a leave request
export async function createLeave(req: AuthRequest, res: Response) {
  const user = req.user!;
  const { type, startDate, endDate, reason, employeeId } = req.body;

  if (!startDate || !endDate) {
    throw AppError.validation("startDate and endDate are required", "createLeave");
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(+start) || isNaN(+end) || end < start) {
    throw AppError.validation("Invalid date range", "createLeave");
  }

  let targetId: number;
  if (user.role === Role.EMPLOYEE) {
    const emp = await myEmployee(user.userId);
    if (!emp) throw AppError.validation("No employee record is linked to your account.", "createLeave");
    targetId = emp.id;
  } else {
    if (!employeeId) throw AppError.validation("employeeId is required", "createLeave");
    targetId = Number(employeeId);
  }

  const days = daysInclusive(start, end);
  const leave = await prisma.leaveRequest.create({
    data: {
      type: (type as any) || "annual",
      startDate: start,
      endDate: end,
      days,
      reason: reason || null,
      employeeId: targetId,
    },
    include: { employee: true },
  });

  if (leave.employee.managerId) {
    await createNotification(
      leave.employee.managerId,
      "leave",
      `${leave.employee.name} requested ${days} day(s) of ${leave.type} leave.`
    );
  }

  return res.status(201).json(leave);
}

// GET /api/leave — role-scoped list
export async function listLeave(req: AuthRequest, res: Response) {
  const user = req.user!;
  const where: any = {};

  if (user.role === Role.EMPLOYEE) {
    const emp = await myEmployee(user.userId);
    where.employeeId = emp ? emp.id : -1;
  } else if (user.role === Role.MANAGER) {
    where.employee = { managerId: user.userId };
  } // HR / ADMIN → all

  const requests = await prisma.leaveRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      employee: {
        select: { id: true, name: true, email: true, department: true, annualLeaveBalance: true },
      },
    },
  });

  return res.json(requests);
}

// PATCH /api/leave/:id — approve or reject
export async function reviewLeave(req: AuthRequest, res: Response) {
  const user = req.user!;
  if (![Role.ADMIN, Role.HR, Role.MANAGER].includes(user.role as any)) {
    throw AppError.forbidden("You are not authorized to review leave requests.", "reviewLeave");
  }

  const id = Number(req.params.id);
  const status = req.body.status;
  if (!["approved", "rejected"].includes(status)) {
    throw AppError.validation("status must be 'approved' or 'rejected'", "reviewLeave");
  }

  const leave = await prisma.leaveRequest.findUnique({ where: { id }, include: { employee: true } });
  if (!leave) throw AppError.notFound("Leave request not found", "reviewLeave");
  if (leave.status !== "pending") {
    throw AppError.validation("This request has already been reviewed.", "reviewLeave");
  }
  if (user.role === Role.MANAGER && leave.employee.managerId !== user.userId) {
    throw AppError.forbidden("You can only review your own team's requests.", "reviewLeave");
  }

  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: { status: status as any, reviewedById: user.userId },
    include: { employee: true },
  });

  // Deduct balance for approved annual leave
  if (status === "approved" && updated.type === "annual") {
    await prisma.employee.update({
      where: { id: updated.employeeId },
      data: {
        annualLeaveBalance: Math.max(0, updated.employee.annualLeaveBalance - updated.days),
      },
    });
  }

  // Notify the employee (in-app + email via external n8n)
  if (updated.employee.userId) {
    await createNotification(
      updated.employee.userId,
      "leave",
      `Your ${updated.type} leave request (${updated.days} day(s)) was ${status}.`
    );
  }
  await sendEmailViaN8n({
    employee: {
      id: updated.employee.id,
      name: updated.employee.name,
      email: updated.employee.email,
    },
    documentType: `leave-${status}`,
    message: `Your ${updated.type} leave request (${updated.days} day(s)) has been ${status}.`,
  });

  return res.json(updated);
}
