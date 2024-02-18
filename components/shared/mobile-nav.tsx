'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navLinks, navSettingLinks } from '@/lib/constants';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image src="/images/logo-text.svg" alt="logo" width={180} height={28} />
      </Link>

      <nav className="flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />

          <Sheet>
            <SheetTrigger>
              <Image
                src="/icons/menu.svg"
                alt="mobile menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-90 w-full">
              <Image src="/images/logo-text.svg" alt="logo" width={152} height={23} />

              <div className="flex h-full flex-col justify-between">
                <ul className="header-nav_elements">
                  {navLinks.map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li
                        key={link.route}
                        className={cn(
                          'sidebar-nav_element group text-gray-700',
                          isActive && 'bg-purple-gradient text-white'
                        )}
                      >
                        <Link href={link.route} className="sidebar-link">
                          <Image
                            src={link.icon}
                            alt={link.label}
                            width={24}
                            height={24}
                            className={cn(isActive && 'brightness-200')}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <ul className="header-nav_elements">
                  {navSettingLinks.map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li
                        key={link.route}
                        className={cn(
                          'sidebar-nav_element group text-gray-700',
                          isActive && 'bg-purple-gradient text-white'
                        )}
                      >
                        <Link href={link.route} className="sidebar-link">
                          <Image
                            src={link.icon}
                            alt={link.label}
                            width={24}
                            height={24}
                            className={cn(isActive && 'brightness-200')}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}

                  <li className="cursor-pointer gap-2 p-4">
                    <UserButton afterSignOutUrl="/" showName />
                  </li>
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
