import { z } from "zod";

const FundPoolStatusSchema = z.enum(["open", "completed"])

// API Create Schema
export const FundPoolCreateSchema = z.object({
  startup_id: z.string().uuid(),
  fund_goal: z.number().int(),
})

// API Update Schema (everything optional except updated_at)
export const FundPoolUpdateSchema = z.object({
  fund_goal: z.number().int().optional(),
  status: FundPoolStatusSchema.optional(),
  updated_at: z.string().datetime()
})
