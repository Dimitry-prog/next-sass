import { User } from '@prisma/client';

import { aspectRatioOptions } from '@/lib/constants';

declare global {
  interface CustomJwtSessionClaims {
    user?: User;
  }
}

export type SearchParamsType = {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
};

export type AspectRatioKeyType = keyof typeof aspectRatioOptions;

export type CheckoutTransactionType = {
  plan: string;
  credits: number;
  amount: number;
  userId: string;
};

export type CreateTransactionType = {
  stripeId: string;
  amount: number;
  credits: number;
  plan: string;
  userId: string;
};
