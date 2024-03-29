'use client';

import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { CldImage, getCldImageUrl } from 'next-cloudinary';
import { Dispatch, SetStateAction } from 'react';

import { Button } from '@/components/ui/button';
import { ImageType, TransformationConfigType } from '@/features/transformation/types';
import { dataUrl, download, getImageSize } from '@/lib/utils';

type TransformedImageProps = {
  image: Partial<ImageType> | undefined;
  type: string;
  title: string;
  isTransforming: boolean;
  setIsTransforming?: Dispatch<SetStateAction<boolean>>;
  transformationConfig: TransformationConfigType | undefined;
  hasDownload?: boolean;
};

const TransformedImage = ({
  image,
  isTransforming,
  setIsTransforming,
  hasDownload = false,
  type,
  title,
  transformationConfig,
}: TransformedImageProps) => {
  const handleDownloadImage = () => {
    download(
      getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId as string,
        ...transformationConfig,
      }),
      title
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>

        {hasDownload && (
          <Button onClick={handleDownloadImage} className="download-btn" variant="outline">
            <Image
              src="/icons/download.svg"
              alt="download"
              width={24}
              height={24}
              className="pb-1.5"
            />
          </Button>
        )}
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            alt={title}
            src={image?.publicId}
            width={getImageSize(type, image, 'width')}
            height={getImageSize(type, image, 'height')}
            sizes={'(max-width: 767px) 100vw, 50vw'}
            placeholder={dataUrl as PlaceholderValue}
            onLoad={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            onError={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            className="transformed-image"
            {...transformationConfig}
          />

          {isTransforming && (
            <div className="transforming-loader">
              <Image src="/icons/spinner.svg" alt="loader" width={50} height={50} />
              <p className="text-white/80">Please wait...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed Image</div>
      )}
    </div>
  );
};

export default TransformedImage;
