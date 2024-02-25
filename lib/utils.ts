import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ImageType } from '@/features/transformation/types';
import { aspectRatioOptions } from '@/lib/constants';
import { AspectRatioKeyType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  if (typeof error === 'string') {
    console.log(error);
    return {
      error,
    };
  }

  if (error instanceof Error) {
    console.log(error);
    return {
      error: error.message,
    };
  }

  return {
    error: JSON.stringify(error),
  };
};

export const deepCopyObjects = <T extends object | undefined>(objects: (T | null)[]) => {
  const filteredObjects = objects.filter((obj) => obj !== undefined) as T[];
  const copiedObjects = filteredObjects.map((obj) => JSON.parse(JSON.stringify(obj)));
  return Object.assign({}, ...copiedObjects);
};

export const getImageSize = (
  type: string,
  image: Partial<ImageType> | undefined,
  dimension: 'width' | 'height'
): number => {
  if (type === 'fill') {
    return aspectRatioOptions[image?.aspectRatio as AspectRatioKeyType]?.[dimension] || 1000;
  }
  return image?.[dimension] || 1000;
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export const dataUrl = `data:image/svg+xml;base64,${toBase64(shimmer(1000, 1000))}`;
