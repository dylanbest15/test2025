import { z } from "zod";

const nameRegex = /^[a-zA-Z\s'-]+$/;

export const StartupCreateSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().min(2).max(30),
  city: z.string().min(2).max(50).regex(nameRegex),
  state: z.string().min(2).max(2).regex(nameRegex),
  overview: z.string().min(2).max(200),
  year_founded: z.number().int().gte(1800, "Year founded must be no earlier than 1800")
    .lte(new Date().getFullYear(), `Year founded can't be in the future`),
});