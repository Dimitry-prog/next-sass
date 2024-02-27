import Image from 'next/image';
import Link from 'next/link';

import ImageList from '@/components/shared/image-list';
import { getAllImages } from '@/features/transformation/actions';
import { navLinks } from '@/lib/constants';

type HomeProps = {
  searchParams: { [key: string]: string | undefined };
};

const Home = async ({ searchParams }: HomeProps) => {
  const searchQuery = searchParams.query || '';
  const page = parseInt(searchParams.page || '1');
  const images = await getAllImages({ page, searchQuery });

  return (
    <>
      <section className="home">
        <h1 className="home-heading">Unleash Your Creative Vision with Imaginify</h1>

        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 6).map((link) => (
            <li key={link.route} className="flex-center flex-col gap-2">
              <Link href={link.route} className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </Link>

              <p className="p-14-medium text-center text-white">{link.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <ImageList
          hasSearch={true}
          images={images?.data || []}
          page={page}
          totalPages={images?.totalPages}
        />
      </section>
    </>
  );
};

export default Home;
