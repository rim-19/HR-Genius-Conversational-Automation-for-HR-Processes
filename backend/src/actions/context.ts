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


  userMessage?: string;
  memory?: any;

  // 🔹 RAG: retrieved HR-handbook passages for a policy question
  knowledge?: { source: string; text: string; score: number }[];

  // 🔹 Aggregated analytics results (avg salary, headcount, ...)
  analytics?: {
    metric: string;
    groupBy: string;
    rows: { group: string; value: number; count: number }[];
  };
}




