import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import React from 'react';
import './globals.css';
import AuthProvider from '#/components/NextAuthProvide';
import { Session } from 'next-auth';

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
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <html lang="en">
      <body className={workSans.className}>
        <AuthProvider session={session}>
          <div className="h-screen w-screen">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
