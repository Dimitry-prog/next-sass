'use server';

import { v2 as cloudinary } from 'cloudinary';
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

export const getAllImages = async ({
  limit = 6,
  page = 1,
  searchQuery = '',
}: {
  limit?: number;
  page?: number;
  searchQuery?: string;
}) => {
  try {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = 'folder=create-images';

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search.expression(expression).execute();
    const resourcedIds: string[] = resources.map((resource: any) => resource.public_id);

    const totalImages = await db.image.count({
      where: {
        publicId: {
          in: resourcedIds,
        },
      },
    });

    const dbImages = await db.image.count();

    const images = await db.image.findMany({
      where: {
        publicId: {
          in: resourcedIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: limit * (page - 1),
    });

    return {
      data: images,
      totalPages: Math.ceil(totalImages / limit),
      dbImages,
    };
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};
