'use server';

import { redirect } from 'next/navigation';
import Stripe from 'stripe';

import { updateCredits } from '@/features/user/actions';
import { db } from '@/lib/db';
import { handleError } from '@/lib/utils';
import { CheckoutTransactionType, CreateTransactionType } from '@/types';

export const checkoutCredits = async (transaction: CheckoutTransactionType) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = transaction.amount * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      data: transaction.plan,
      credits: transaction.credits,
      userId: transaction.userId,
    },
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  });

  redirect(session.url!);
};

export const createTransaction = async (transaction: CreateTransactionType) => {
  try {
    const newTransaction = await db.transaction.create({
      data: {
        ...transaction,
      },
    });

    await updateCredits(transaction.userId, transaction.credits);

    return newTransaction;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};
