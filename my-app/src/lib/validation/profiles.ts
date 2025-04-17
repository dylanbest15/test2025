import { z } from 'zod';

const nameRegex = /^[a-zA-Z\s'-]+$/;

export const ProfileUpdateSchema = z.object({
  first_name: z.string().min(2).max(30).regex(nameRegex).optional(),
  last_name: z.string().min(2).max(30).regex(nameRegex).optional(),
  bio: z.string().max(250).optional(),
  updated_at: z.string().datetime()
});