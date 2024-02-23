'use client';

import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { Dispatch, SetStateAction } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { dataUrl, getImageSize } from '@/lib/utils';

type MediaUploaderProps = {
  onValueChange: (values: string) => void;
  setImage: Dispatch<SetStateAction<Record<string, string | number> | undefined>>;
  publicId: string;
  image: unknown;
  type: string;
};

const MediaUploader = ({ onValueChange, setImage, publicId, image, type }: MediaUploaderProps) => {
  const { toast } = useToast();

  const handleUploadSuccess = (result: any) => {
    setImage((prev) => ({
      ...prev,
      publicId: result?.public_id,
      width: result?.width,
      height: result?.height,
      secureUrl: result?.secure_url,
    }));

    onValueChange(result?.public_id);

    toast({
      title: 'Image uploaded successfully',
      description: 'One credit was deducted from your account',
      duration: 5000,
      className: 'success-toast',
    });
  };

  const handleUploadError = () => {
    toast({
      title: 'Something went wrong while uploading',
      description: 'Please try again',
      duration: 5000,
      className: 'error-toast',
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="create-images"
      options={{
        multiple: false,
        resourceType: 'image',
      }}
      onSuccess={handleUploadSuccess}
      onError={handleUploadError}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">Original</h3>

          {publicId ? (
            <div className="cursor-pointer overflow-hidden rounded-md">
              <CldImage
                alt="image"
                src={publicId}
                width={getImageSize(type, image, 'width')}
                height={getImageSize(type, image, 'height')}
                sizes={'(max-width: 767px) 100vw, 50vw'}
                placeholder={dataUrl as PlaceholderValue}
                className="media-uploader_cldImage"
              />
            </div>
          ) : (
            <div onClick={() => open()} className="media-uploader_cta">
              <div className="media-uploader_cta-image">
                <Image src="/icons/add.svg" alt="add image" width={24} height={24} />
              </div>

              <p className="p-14-medium">Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
