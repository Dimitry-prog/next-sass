import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

import DeleteConfirmation from '@/components/shared/delete-confirmation';
import { Button } from '@/components/ui/button';
import { getImageById } from '@/features/transformation/actions';
import TransformationTypeHeader from '@/features/transformation/components/header';
import TransformedImage from '@/features/transformation/components/transformed-image';
import { ImageType, TransformationConfigType } from '@/features/transformation/types';
import { getImageSize } from '@/lib/utils';

type TransformationsPageProps = {
  params: {
    transformationId: string;
  };
};

const TransformationsPage = async ({ params: { transformationId } }: TransformationsPageProps) => {
  const { sessionClaims } = auth();
  const image = await getImageById(transformationId);

  return (
    <>
      <TransformationTypeHeader title={image?.title as string} />

      <section className="mt-5 flex flex-wrap gap-4">
        <div className="p-14-medium md:p-16-medium flex gap-2">
          <p className="text-dark-600">Transformation:</p>
          <p className=" capitalize text-purple-400">{image?.transformation}</p>
        </div>

        {image?.prompt && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2 ">
              <p className="text-dark-600">Prompt:</p>
              <p className=" capitalize text-purple-400">{image?.prompt}</p>
            </div>
          </>
        )}

        {image?.color && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Color:</p>
              <p className=" capitalize text-purple-400">{image?.color}</p>
            </div>
          </>
        )}

        {image?.aspectRatio && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Aspect Ratio:</p>
              <p className=" capitalize text-purple-400">{image?.aspectRatio}</p>
            </div>
          </>
        )}
      </section>

      <section className="mt-10 border-t border-dark-400/15">
        {image && (
          <div className="transformation-grid">
            <div className="flex flex-col gap-4">
              <h3 className="h3-bold text-dark-600">Original</h3>

              <Image
                width={getImageSize(image?.transformation, image as Partial<ImageType>, 'width')}
                height={getImageSize(image?.transformation, image as Partial<ImageType>, 'height')}
                src={image?.secureUrl}
                alt="image"
                className="transformation-original_image"
              />
            </div>

            <TransformedImage
              image={image as Partial<ImageType>}
              type={image?.transformation}
              title={image?.title}
              isTransforming={false}
              transformationConfig={image?.config as TransformationConfigType}
              hasDownload={true}
            />
          </div>
        )}

        {sessionClaims?.user?.id === image?.user.id && (
          <div className="mt-4 space-y-4">
            <Button asChild type="button" className="submit-button capitalize">
              <Link href={`/transformations/${image?.id}/update`}>Update Image</Link>
            </Button>

            <DeleteConfirmation imageId={image?.id as string} />
          </div>
        )}
      </section>
    </>
  );
};

export default TransformationsPage;
