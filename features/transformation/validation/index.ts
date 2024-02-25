import { z } from 'zod';

export const transformationSchema = z.object({
  title: z.string().min(1, { message: 'Required field' }),
  publicId: z.string().min(1, { message: 'Required field' }),
  aspectRatio: z.string().min(1, { message: 'Required field' }),
  color: z.string().optional(),
  prompt: z.string().optional(),
});
