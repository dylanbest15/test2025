import { z } from "zod";

export const MemberCreateSchema = z.object({
  startup_id: z.string(),
  profile_id: z.string(),
  role: z.string(),
});