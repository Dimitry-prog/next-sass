import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { getImageById } from '@/features/transformation/actions';
import TransformationForm from '@/features/transformation/components/form';
import TransformationTypeHeader from '@/features/transformation/components/header';
import { ImageType, TransformationType } from '@/features/transformation/types';
import { getUserById } from '@/features/user/actions';
import { transformationTypes } from '@/lib/constants';

type UpdateTransformationsPageProps = {
  params: {
    transformationId: string;
  };
};

const UpdateTransformationsPage = async ({
  params: { transformationId },
}: UpdateTransformationsPageProps) => {
  const { sessionClaims } = auth();

  if (!sessionClaims?.user) redirect('/sign-in');

  const user = await getUserById(sessionClaims?.user?.id as string);
  const image = await getImageById(transformationId);

  const transformation = transformationTypes[image?.transformation as TransformationType];

  return (
    <>
      <TransformationTypeHeader title={transformation.title} subtitle={transformation.subtitle} />

      <section className="mt-10">
        <TransformationForm
          action="update"
          userId={user?.id as string}
          type={image?.transformation as TransformationType}
          creditBalance={user?.creditBalance as number}
          config={image?.config as object}
          imageData={image as Partial<ImageType>}
        />
      </section>
    </>
  );
};

export default UpdateTransformationsPage;
