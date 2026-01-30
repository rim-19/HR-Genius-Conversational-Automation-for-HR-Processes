import { Employee, Document } from "@prisma/client";
export interface ExecutionContext {
  intent?: any;
  pdfPath?: string;
  pdfUrl?: string;

  user: {
    id: number;
    role: string;
    email?: string;
  };
   system: {
    today: string;
  };
  employee?: any;
  employeeDeleted?: boolean;

  // 🔹 Multiple employees (LIST / SEARCH)
  employees?: Employee[];

  // 🔹 Multiple documents (LIST / SEARCH)
  documents?: (Document & { employee: { id: number; name: string; email: string } })[];


}




