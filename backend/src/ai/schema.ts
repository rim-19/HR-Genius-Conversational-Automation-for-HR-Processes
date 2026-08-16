import { z } from "zod";

export const HRIntentSchema = z.object({
  intent: z.enum([
    "create_employee",
    "update_employee",
    "delete_employee",
    "generate_document",
    "list_employees",
    "list_documents",
    "policy_question",
    "general_inquiry",
  ]),

  documentType: z.enum([
    "promotion",
    "salary",
    "leave",
    "employment",
    "custom",
  ]).nullable().optional(),

  employeeName: z.string().nullable().optional(),

  extraData: z.record(z.string(), z.any()).nullable().optional(),

  filters: z.record(z.string(), z.any()).nullable().optional(),
});
