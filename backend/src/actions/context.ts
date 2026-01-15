import { Employee } from "@prisma/client";
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


}




