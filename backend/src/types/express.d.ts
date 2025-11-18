import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        name: string;
        role: Role;
      };
    }
  }
}

export {};
