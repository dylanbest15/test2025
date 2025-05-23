import { z } from "zod";

// API Create Schema
export const FavoriteCreateSchema = z.object({
  startup_id: z.string().uuid(),
  profile_id: z.string().uuid(),
})