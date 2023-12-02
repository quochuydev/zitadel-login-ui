import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import React from 'react';
import './globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: '600',
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
      </body>
    </html>
  );
}
