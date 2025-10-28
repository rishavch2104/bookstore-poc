import { z } from 'zod';
export const reviewSchema = z.object({
  rating: z.string(),
  title: z.string(),
  body: z.string(),
});
