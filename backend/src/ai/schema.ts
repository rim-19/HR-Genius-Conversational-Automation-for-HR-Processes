import { z } from "zod";

export const HRIntentSchema = z.object({
  intent: z.literal("generate_document"),
  documentType: z.enum([
    "promotion",
    "salary",
    "leave",
    "employment"
  ]),
  employeeName: z.string(),
  extraData: z.record(z.string(), z.any()).optional()

});
