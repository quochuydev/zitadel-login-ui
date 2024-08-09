'use client';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';
import { Session } from 'next-auth';

type Props = {
  children: ReactNode;
  session: Session;
};

const AuthProvider = ({ children, session }: Props) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthProvider;
