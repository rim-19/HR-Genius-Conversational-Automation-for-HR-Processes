import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
