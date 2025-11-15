import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      email: string;
      name: string;
      role: Role;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
