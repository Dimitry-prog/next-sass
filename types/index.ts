import { aspectRatioOptions } from '@/lib/constants';

declare global {
  interface CustomJwtSessionClaims {
    user?: {
      userId: string;
    };
  }
}

export type SearchParamsType = {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
};

export type AspectRatioKeyType = keyof typeof aspectRatioOptions;
