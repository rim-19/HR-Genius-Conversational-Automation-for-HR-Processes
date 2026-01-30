// backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      throw AppError.validation('Missing fields', 'register');
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw AppError.validation('Email already used', 'register');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role }
    });

    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    throw err;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw AppError.validation('Missing fields', 'login');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw AppError.unauthorized('Invalid credentials', 'login');
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw AppError.unauthorized('Invalid credentials', 'login');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    throw err;
  }
};

export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw AppError.unauthorized('Not authenticated', 'getCurrentUser');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });
    if (!user) {
      throw AppError.notFound('User not found', 'getCurrentUser');
    }
    return res.json(user);
  } catch (err) {
    throw err;
  }
};
