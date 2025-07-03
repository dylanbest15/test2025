import { z } from "zod";

const InvestmentStatusSchema = z.enum(["needs_action", "pending", "confirmed", "declined", "withdrawn", 'inactive'])

// API Create Schema
export const InvestmentCreateSchema = z.object({
  amount: z.number().int(),
  fund_pool_id: z.string().uuid(),
  startup_id: z.string().uuid(),
  profile_id: z.string().uuid(),
})

// API Update Schema (everything optional except updated_at)
export const InvestmentUpdateSchema = z.object({
  amount: z.number().int().optional(),
  status: InvestmentStatusSchema.optional(),
  updated_at: z.string().datetime()
})