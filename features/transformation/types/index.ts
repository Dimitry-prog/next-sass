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

export type ImageType = {
  id: string;
  title: string;
  publicId: string;
  transformation: string;
  width: number;
  height: number;
  secureUrl: string;
  transformationUrl: string;
  aspectRatio: string | undefined;
  prompt: string | undefined;
  color: string | undefined;
  config: TransformationConfigType | undefined;
};
