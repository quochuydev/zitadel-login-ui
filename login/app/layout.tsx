import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import React, { Suspense } from 'react';
import './globals.css';
import LanguageSwitcher from '#/components/LanguageSwitcher';
import { Toaster } from '#/components/ui/sonner';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Account',
  icons: '/images/favicon.ico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={workSans.className}>
        <div className="h-screen w-screen">{children}</div>
        <Suspense>
          <LanguageSwitcher />
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
