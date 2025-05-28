import { z } from "zod";

// const InvestmentStatusSchema = z.enum(["needs action", "pending", "confirmed", "declined", "withdrawn"])

// API Create Schema
export const InvestmentCreateSchema = z.object({
  amount: z.number().int(),
  fund_pool_id: z.string().uuid(),
  startup_id: z.string().uuid(),
  profile_id: z.string().uuid(),
})