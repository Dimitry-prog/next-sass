import { z } from 'zod';

import { transformationSchema } from '@/features/transformation/validation';

export type TransformationType = 'restore' | 'removeBackground' | 'fill' | 'remove' | 'recolor';

export type TransformationFormDataType = z.infer<typeof transformationSchema>;

export type TransformationConfigType = {
  restore?: boolean;
  fillBackground?: boolean;
  remove?: {
    prompt: string;
    removeShadow?: boolean;
    multiple?: boolean;
  };
  recolor?: {
    prompt?: string;
    to: string;
    multiple?: boolean;
  };
  removeBackground?: boolean;
};
