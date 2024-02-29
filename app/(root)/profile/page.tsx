import { auth } from '@clerk/nextjs';
import Image from 'next/image';

import ImageList from '@/components/shared/image-list';
import { getUserImages } from '@/features/transformation/actions';
import TransformationTypeHeader from '@/features/transformation/components/header';
import { getUserById } from '@/features/user/actions';
import { SearchParamsType } from '@/types';

const ProfilePage = async ({ searchParams }: SearchParamsType) => {
  const page = Number(searchParams?.page) || 1;
  const { sessionClaims } = auth();

  const user = await getUserById(sessionClaims?.user?.id as string);
  const images = await getUserImages({ page, userId: user?.id as string });

  return (
    <>
      <TransformationTypeHeader title="Profile" />

      <section className="profile">
        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{user?.creditBalance}</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/icons/photo.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{images?.data.length}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-14">
        <ImageList images={images?.data || []} totalPages={images?.totalPages} page={page} />
      </section>
    </>
  );
};

export default ProfilePage;
