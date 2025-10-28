import { z } from 'zod';
export const authorSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
  dateOfBirth: z.string().optional(),
});
