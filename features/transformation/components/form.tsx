'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { getCldImageUrl } from 'next-cloudinary';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import MediaUploader from '@/components/shared/media-uploader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createImage, updateImage } from '@/features/transformation/actions';
import TransformedImage from '@/features/transformation/components/transformed-image';
import {
  ImageType,
  TransformationConfigType,
  TransformationFormDataType,
  TransformationType,
} from '@/features/transformation/types';
import { transformationSchema } from '@/features/transformation/validation';
import { updateCredits } from '@/features/user/actions';
import {
  aspectRatioOptions,
  creditFee,
  transformationFormDataDefaultValues,
  transformationTypes,
} from '@/lib/constants';
import { deepCopyObjects } from '@/lib/utils';
import { AspectRatioKeyType } from '@/types';

type TransformationFormProps = {
  action: 'create' | 'update';
  userId: string;
  type: TransformationType;
  creditBalance: number;
  imageData?: Partial<ImageType>;
  config?: TransformationConfigType;
};

const TransformationForm = ({
  action,
  userId,
  type,
  creditBalance,
  imageData,
  config,
}: TransformationFormProps) => {
  const router = useRouter();
  const [image, setImage] = useState(imageData);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [newTransformation, setNewTransformation] = useState<TransformationConfigType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isPenging, startTransition] = useTransition();

  const transformationType = transformationTypes[type];
  const initValues =
    imageData && action === 'update'
      ? {
          title: imageData?.title,
          publicId: imageData?.publicId,
          aspectRatio: imageData?.aspectRatio,
          color: imageData?.color,
          prompt: imageData?.prompt,
        }
      : transformationFormDataDefaultValues;

  const form = useForm<TransformationFormDataType>({
    resolver: zodResolver(transformationSchema),
    defaultValues: initValues,
  });

  const handleSelectField = (value: string, onChange: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKeyType];

    setImage((prev) => ({
      ...prev,
      aspectRation: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));

    setNewTransformation(transformationType.config);

    return onChange(value);
  };

  const handleChange = (
    fieldName: string,
    value: string,
    type: keyof TransformationConfigType,
    onChange: (value: string) => void
  ) => {
    setNewTransformation((prev) => ({
      ...prev,
      [type]: {
        ...(prev?.[type] as object),
        [fieldName === 'prompt' ? 'prompt' : 'to']: value,
      },
    }));

    return onChange(value);
  };

  const handleTransformation = async () => {
    setIsTransforming(true);

    setTransformationConfig(deepCopyObjects([newTransformation, transformationConfig]));
    setNewTransformation(null);

    startTransition(async () => {
      await updateCredits(userId, creditFee);
    });
  };

  const onSubmit: SubmitHandler<TransformationFormDataType> = async (values) => {
    console.log(values);
    setIsSubmitting(true);

    if (imageData || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId as string,
        ...transformationConfig,
      });

      const createImageData = {
        title: values.title,
        publicId: values.publicId,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
        transformation: type,
        width: image?.width as number,
        height: image?.height as number,
        config: transformationConfig,
        secureUrl: image?.secureUrl as string,
        transformationUrl,
      };
      console.log('createImageData', createImageData);
      if (action === 'create') {
        const newImage = await createImage(createImageData, userId, '/');

        if (newImage) {
          setImage(imageData);
          router.push(`/transformations/${newImage.id}`);
        }
      }

      if (action === 'update') {
        const updatedImage = await updateImage(
          {
            ...createImageData,
            id: imageData?.id as string,
          },
          userId,
          `/transformations/${imageData?.id}`
        );

        if (updatedImage) {
          router.push(`/transformations/${updatedImage.id}`);
        }
      }
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Image Title</FormLabel>
              <FormControl>
                <Input placeholder="Image title" {...field} className="input-field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'fill' && (
          <FormField
            control={form.control}
            name="aspectRatio"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Aspect Ratio</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => handleSelectField(value, field.onChange)}>
                    <SelectTrigger className="select-field">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(aspectRatioOptions).map((key) => (
                        <SelectItem key={key} value={key} className="select-item">
                          {aspectRatioOptions[key as AspectRatioKeyType].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(type === 'remove' || type === 'recolor') && (
          <div className="prompt-field">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {type === 'remove' ? 'Object to remove' : 'Object to recolor'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={(e) => handleChange('prompt', e.target.value, type, field.onChange)}
                      placeholder={type === 'remove' ? 'Object to remove' : 'Object to recolor'}
                      className="input-field"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'recolor' && (
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Replacement Color</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={(e) =>
                          handleChange('color', e.target.value, 'recolor', field.onChange)
                        }
                        placeholder="Replacement color"
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        <div className="media-uploader-field">
          <FormField
            control={form.control}
            name="publicId"
            render={({ field }) => (
              <FormItem className="flex size-full flex-col">
                <FormControl>
                  <MediaUploader
                    onValueChange={field.onChange}
                    setImage={setImage}
                    publicId={field.value}
                    image={image}
                    type={type}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            onClick={handleTransformation}
            disabled={isTransforming || newTransformation === null}
            type="button"
            className="submit-button capitalize"
          >
            {isTransforming ? 'Transforming...' : 'Apply transformation'}
          </Button>

          <Button
            disabled={form.formState.isSubmitting || isSubmitting}
            type="submit"
            className="submit-button capitalize"
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
