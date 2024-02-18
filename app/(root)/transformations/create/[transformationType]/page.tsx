import TransformationTypeHeader from '@/features/transformation/components/header';
import { TransformationType } from '@/features/transformation/types';
import { transformationTypes } from '@/lib/constants';
import { SearchParamsType } from '@/types';

const CreateTransformationsTypePage = ({ params: { transformationType } }: SearchParamsType) => {
  const transformation = transformationTypes[transformationType as TransformationType];

  return (
    <TransformationTypeHeader title={transformation.title} subtitle={transformation.subtitle} />
  );
};

export default CreateTransformationsTypePage;
