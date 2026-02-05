import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { Role } from '@prisma/client';

// -----------------------------
// GET ALL EMPLOYEES
// -----------------------------
export const getEmployees = async (req: Request, res: Response) => {
  const user = req.user!;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    let whereClause: any = {};

    if (user.role === Role.MANAGER) {
      whereClause.managerId = user.userId;
    } else if (user.role !== Role.ADMIN && user.role !== Role.HR) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where: whereClause,
        include: { manager: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where: whereClause }),
    ]);

    res.json({
      employees,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

// -----------------------------
// GET EMPLOYEE BY ID
// -----------------------------
export const getEmployeeById = async (req: Request, res: Response) => {
  const user = req.user!;
  const id = Number(req.params.id);

  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { manager: true, documents: true },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Managers can ONLY see employees they manage
    if (user.role === Role.MANAGER && employee.managerId !== user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Employees cannot view other employees
    if (user.role === Role.EMPLOYEE) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error });
  }
};

// -----------------------------
// CREATE EMPLOYEE
// -----------------------------
export const createEmployee = async (req: Request, res: Response) => {
  const user = req.user!;
  const { name, email, position, department, salary, managerId } = req.body;

  try {
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        position,
        department,
        salary,
        managerId: managerId || null,
        createdById: user.userId,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee', error });
  }
};

// -----------------------------
// UPDATE EMPLOYEE
// -----------------------------
export const updateEmployee = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = req.user!;

  if (user.role !== Role.ADMIN && user.role !== Role.HR) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const updated = await prisma.employee.update({
      where: { id },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
};

// -----------------------------
// DELETE EMPLOYEE
// -----------------------------
export const deleteEmployee = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = req.user!;

  if (user.role !== Role.ADMIN) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    await prisma.employee.delete({
      where: { id },
    });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};
