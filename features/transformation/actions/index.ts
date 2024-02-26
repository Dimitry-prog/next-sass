'use server';

import { revalidatePath } from 'next/cache';

import { ImageType } from '@/features/transformation/types';
import { db } from '@/lib/db';
import { handleError } from '@/lib/utils';

export const createImage = async (image: Omit<ImageType, 'id'>, userId: string, path: string) => {
  try {
    const author = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!author) {
      throw new Error('User not found');
    }

    const createImage = await db.image.create({
      data: {
        ...image,
        userId: author.id,
      },
    });

    revalidatePath(path);
    return createImage;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};

export const updateImage = async (image: ImageType, userId: string, path: string) => {
  try {
    const updateImage = await db.image.findFirst({
      where: {
        id: image.id,
      },
    });

    if (!updateImage || updateImage.userId !== userId) {
      throw new Error('Image not found');
    }

    const updatedImage = await db.image.update({
      where: {
        id: image.id,
      },
      data: {
        ...image,
      },
    });

    revalidatePath(path);
    return updatedImage;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};

export const deleteImage = async (imageId: string) => {
  try {
    const deleteImage = await db.image.delete({
      where: {
        id: imageId,
      },
    });

    return deleteImage;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};

export const getImageById = async (imageId: string) => {
  try {
    const image = db.image.findFirst({
      where: {
        id: imageId,
      },
      select: {
        user: true,
      },
    });

    return image;
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};
