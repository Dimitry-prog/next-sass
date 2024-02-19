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

// export const deepCopyObjects = <T extends object>(objects: T[]) => {
//   const copiedObjects = objects.map((obj) => JSON.parse(JSON.stringify(obj)));
//   return Object.assign({}, ...copiedObjects);
// };

export const deepCopyObjects = <T extends object | null>(objects: (T | null)[]) => {
  const filteredObjects = objects.filter((obj) => obj !== null) as T[];
  const copiedObjects = filteredObjects.map((obj) => JSON.parse(JSON.stringify(obj)));
  return Object.assign({}, ...copiedObjects);
};
