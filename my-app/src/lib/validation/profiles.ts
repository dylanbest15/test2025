import { z } from 'zod';

const nameRegex = /^[a-zA-Z\s'-]+$/;

// API Update Schema (everything optional except updated_at)
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

// UI Name and Bio Schema (founder)
export const FounderNameAndBioSchema = z.object({
  first_name: z.string().min(2).max(30).regex(nameRegex),
  last_name: z.string().min(2).max(30).regex(nameRegex),
  bio: z.string().max(300).optional(),
  founder_title: z.string().min(2).max(30).regex(nameRegex)
})

// UI Name and Bio Schema (investor)
export const InvestorNameAndBioSchema = z.object({
  first_name: z.string().min(2).max(30).regex(nameRegex),
  last_name: z.string().min(2).max(30).regex(nameRegex),
  bio: z.string().max(300).optional(),
})