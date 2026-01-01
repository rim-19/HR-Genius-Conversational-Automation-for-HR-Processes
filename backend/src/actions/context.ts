export interface ExecutionContext {
  intent?: any;
  employee?: any;
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
}
