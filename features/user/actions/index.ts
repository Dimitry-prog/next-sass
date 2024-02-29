'use server';

import { UserType, UserUpdateType } from '@/features/user/types';
import { db } from '@/lib/db';
import { handleError } from '@/lib/utils';

export const createUser = async (userData: UserType) => {
  try {
    const user = await db.user.create({
      data: userData,
    });

    return user;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};

export const updateUser = async (userData: UserUpdateType) => {
  try {
    const user = await db.user.update({
      where: {
        clerkId: userData.clerkId,
      },
      data: userData.data,
    });

    return user;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};

export const deleteUser = async (clerkId: string) => {
  try {
    const user = await db.user.delete({
      where: {
        clerkId,
      },
    });

    return user;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};

export const updateCredits = async (userId: string, creditFee: number) => {
  try {
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        creditBalance: {
          increment: creditFee,
        },
      },
    });

    return user;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};
