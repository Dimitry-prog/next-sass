'use client';

import { Image } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ImageItem from '@/components/shared/image-item';
import Search from '@/components/shared/search';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type ImageListProps = {
  images: Image[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
};

const ImageList = ({ hasSearch = false, images, totalPages = 1, page }: ImageListProps) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const handlePagination = (direction: string) => {
    direction === 'prev'
      ? params.set('page', (page - 1).toString())
      : params.set('page', (page + 1).toString());

    replace(`${pathname}?${params}`);
  };

  return (
    <>
      <div className="collection-heading">
        <h2 className="h2-bold text-dark-600">Recent Edits</h2>
        {hasSearch && <Search />}
      </div>

      {images.length > 0 ? (
        <ul className="collection-list">
          {images.map((image) => (
            <ImageItem image={image} key={image.id} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold">Empty List</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={page <= 1}
              className="collection-btn"
              onClick={() => handlePagination('prev')}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>

            <p className="flex-center p-16-medium w-fit flex-1">
              {page} / {totalPages}
            </p>

            <Button
              className="button w-32 bg-purple-gradient bg-cover text-white"
              onClick={() => handlePagination('next')}
              disabled={page >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default ImageList;
