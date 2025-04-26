import { z } from "zod";

const FundPoolStatusSchema = z.enum(["open", "completed"])

// API Create Schema
export const FundPoolCreateSchema = z.object({
  startup_id: z.string().uuid(),
  fund_goal: z.number().int(),
  status: FundPoolStatusSchema
})