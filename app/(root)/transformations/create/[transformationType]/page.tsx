import { auth } from '@clerk/nextjs';

import TransformationForm from '@/features/transformation/components/form';
import TransformationTypeHeader from '@/features/transformation/components/header';
import { TransformationType } from '@/features/transformation/types';
import { getUserById } from '@/features/user/actions';
import { transformationTypes } from '@/lib/constants';
import { SearchParamsType } from '@/types';

const CreateTransformationsTypePage = async ({
  params: { transformationType },
}: SearchParamsType) => {
  const { sessionClaims, userId } = auth();
  const transformation = transformationTypes[transformationType as TransformationType];
  const user = await getUserById(userId!);

  return (
    <>
      <TransformationTypeHeader title={transformation.title} subtitle={transformation.subtitle} />

      <section className="mt-10">
        <TransformationForm
          action="create"
          userId={sessionClaims?.user?.userId as string}
          creditBalance={user?.creditBalance as number}
          type={transformation.type as TransformationType}
        />
      </section>
    </>
  );
};

export default CreateTransformationsTypePage;
