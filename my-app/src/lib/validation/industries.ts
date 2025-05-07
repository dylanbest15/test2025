import { z } from "zod";

const IndustryTypeSchema = z.enum(['startup', 'investor']);

// API Create Schema
export const IndustryUpdateSchema = z.object({
  type: IndustryTypeSchema,
  industries: z
    .array(z.string().min(1).max(50))
    .min(1, 'At least 1 industry must be selected')
    .max(3, 'You can select up to 3 industries'),
});