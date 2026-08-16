// backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

const ACCESS_TTL = '1h';
const REFRESH_TTL = '7d';
const MAX_FAILED = 5;
const LOCK_MINUTES = 15;

const accessSecret = () => process.env.JWT_SECRET as string;
const refreshSecret = () => (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string;

const signAccess = (user: { id: number; role: string }) =>
  jwt.sign({ userId: user.id, role: user.role }, accessSecret(), { expiresIn: ACCESS_TTL });
const signRefresh = (user: { id: number }) =>
  jwt.sign({ userId: user.id, type: 'refresh' }, refreshSecret(), { expiresIn: REFRESH_TTL });

const publicUser = (u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    throw AppError.validation('Missing fields', 'register');
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw AppError.validation('Email already used', 'register');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed, role } });
  return res.status(201).json(publicUser(user));
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw AppError.validation('Missing fields', 'login');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw AppError.unauthorized('Invalid credentials', 'login');
  }

  // Account lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const mins = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw AppError.unauthorized(`Account temporarily locked. Try again in ${mins} minute(s).`, 'login');
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const attempts = user.failedLoginAttempts + 1;
    const data: any = { failedLoginAttempts: attempts };
    if (attempts >= MAX_FAILED) {
      data.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60000);
      data.failedLoginAttempts = 0; // reset counter once locked
    }
    await prisma.user.update({ where: { id: user.id }, data });
    throw AppError.unauthorized('Invalid credentials', 'login');
  }

  // Successful login → clear any failed-attempt state
  if (user.failedLoginAttempts || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  return res.json({
    token: signAccess(user),
    refreshToken: signRefresh(user),
    user: publicUser(user),
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw AppError.unauthorized('Missing refresh token', 'refresh');
  }

  let decoded: any;
  try {
    decoded = jwt.verify(refreshToken, refreshSecret());
  } catch {
    throw AppError.unauthorized('Invalid or expired refresh token', 'refresh');
  }
  if (decoded.type !== 'refresh') {
    throw AppError.unauthorized('Invalid refresh token', 'refresh');
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    throw AppError.unauthorized('Invalid refresh token', 'refresh');
  }

  return res.json({ token: signAccess(user), user: publicUser(user) });
};

export const getCurrentUser = async (req: any, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw AppError.unauthorized('Not authenticated', 'getCurrentUser');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) {
    throw AppError.notFound('User not found', 'getCurrentUser');
  }
  return res.json(user);
};
