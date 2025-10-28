import { z } from 'zod';
export const bookSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  authorId: z.string().min(1, 'Author is required'),
  publishedDate: z.string().optional(),
  description: z.string().optional(),
});
