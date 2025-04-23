import { z } from 'zod';

const nameRegex = /^[a-zA-Z\s'-]+$/;

export const ProfileUpdateSchema = z.object({
  first_name: z.string().min(2).max(30).regex(nameRegex).optional(),
  last_name: z.string().min(2).max(30).regex(nameRegex).optional(),
  bio: z.string().max(300).optional(),
  founder_title: z.string().min(2).max(30).regex(nameRegex).optional(),
  startup_id: z.string().optional(),
  startup_role: z.string().optional(),
  investor_active: z.boolean().optional(),
  updated_at: z.string().datetime()
});