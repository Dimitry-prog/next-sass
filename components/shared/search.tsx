import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';

import { Input } from '@/components/ui/input';

const Search = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    params.set('page', '1');

    if (!e.target.value) {
      params.delete('query');
    } else {
      params.set('query', e.target.value);
    }
    replace(`${pathname}?${params}`);
  };

  return (
    <div className="search">
      <Image src="/icons/search.svg" alt="search" width={24} height={24} />

      <Input className="search-field" placeholder="Search" onChange={handleSearch} />
    </div>
  );
};

export default Search;
