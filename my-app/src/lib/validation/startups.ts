import { z } from "zod";

const nameRegex = /^[a-zA-Z\s'-]+$/;

// API Create Schema
export const StartupCreateSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().min(2).max(30),
  city: z.string().min(2).max(50).regex(nameRegex),
  state: z.string().min(2).max(2).regex(nameRegex),
  overview: z.string().max(300),
  year_founded: z.number().int().gte(1900, "Year founded must be no earlier than 1900")
    .lte(new Date().getFullYear(), `Year founded can't be in the future`),
});

// API Update Schema (everything optional except updated_at)
export const StartupUpdateSchema = z.object({
  name: z.string().min(2).max(30).optional(),
  email: z.string().min(2).max(30).optional(),
  city: z.string().min(2).max(50).regex(nameRegex).optional(),
  state: z.string().min(2).max(2).regex(nameRegex).optional(),
  logo_url: z.string().min(2).optional(),
  overview: z.string().max(300).optional(),
  year_founded: z.number().int().gte(1900, "Year founded must be no earlier than 1900")
    .lte(new Date().getFullYear(), `Year founded can't be in the future`).optional(),
  updated_at: z.string().datetime()
})

// UI General Info Update Schema
export const StartupGeneralInfoSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().min(2).max(30),
  city: z.string().min(2).max(50).regex(nameRegex),
  state: z.string().min(2).max(2).regex(nameRegex),
  year_founded: z.number().int().gte(1900, "Year founded must be no earlier than 1900")
    .lte(new Date().getFullYear(), `Year founded can't be in the future`)
})

// UI Overview Update Schema
export const StartupOverviewSchema = z.object({
  overview: z.string().max(300).optional()
})