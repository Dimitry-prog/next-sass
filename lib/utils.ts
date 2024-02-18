import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
