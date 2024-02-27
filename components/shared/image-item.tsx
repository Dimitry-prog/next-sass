import { Image as ImageType } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';

import { TransformationType } from '@/features/transformation/types';
import { transformationTypes } from '@/lib/constants';

type ImageItemProps = {
  image: ImageType;
};

const ImageItem = ({ image }: ImageItemProps) => {
  return (
    <li>
      <Link href={`/transformations/${image.id}`} className="collection-card">
        <CldImage
          src={image.publicId}
          alt={image.title}
          width={image.width as number}
          height={image.height as number}
          {...(image?.config as object)}
          loading="lazy"
          className="h-52 w-full rounded-md object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />

        <div className="flex-between">
          <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">{image.title}</p>
          <Image
            src={`/icons/${transformationTypes[image.transformation as TransformationType].icon}`}
            alt={image.title}
            width={24}
            height={24}
          />
        </div>
      </Link>
    </li>
  );
};

export default ImageItem;
