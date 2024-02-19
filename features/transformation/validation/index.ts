import { z } from 'zod';

export const transformationSchema = z.object({
  title: z.string(),
  publicId: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
});
