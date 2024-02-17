import './globals.css';

import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const IBMPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex',
});

export const metadata: Metadata = {
  title: 'Generate Images',
  description: 'Image generator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('font-IBMPlex antialiased', IBMPlex.variable)}>{children}</body>
    </html>
  );
}
