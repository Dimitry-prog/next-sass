import { auth } from '@clerk/nextjs';

import TransformationForm from '@/features/transformation/components/form';
import TransformationTypeHeader from '@/features/transformation/components/header';
import { TransformationType } from '@/features/transformation/types';
import { transformationTypes } from '@/lib/constants';
import { SearchParamsType } from '@/types';

const CreateTransformationsTypePage = async ({
  params: { transformationType },
}: SearchParamsType) => {
  const { sessionClaims } = auth();
  const transformation = transformationTypes[transformationType as TransformationType];

  return (
    <>
      <TransformationTypeHeader title={transformation.title} subtitle={transformation.subtitle} />

      <section className="mt-10">
        <TransformationForm
          action="create"
          userId={sessionClaims?.user?.id as string}
          creditBalance={sessionClaims?.user?.creditBalance as number}
          type={transformation.type as TransformationType}
        />
      </section>
    </>
  );
};

export default CreateTransformationsTypePage;
