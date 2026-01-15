import { z } from "zod";

export const HRIntentSchema = z.object({
  intent: z.enum([
    "create_employee",
    "update_employee",
    "delete_employee",
    "generate_document",
    "list_employees",
  ]),

  documentType: z.enum([
    "promotion",
    "salary",
    "leave",
    "employment",
  ]).optional(),

  employeeName: z.string().optional(),

  extraData: z.record(z.string(), z.any()).optional(),

  filters: z.record(z.string(), z.any()).optional(),
});
