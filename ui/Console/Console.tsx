'use client';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default (props: any) => {
  const { data: session, status } = useSession();

  return (
    <div>
      {JSON.stringify({ session, status })}

      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session?.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
};
