import { Inter } from 'next/font/google';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { config } from '@/config';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [userInfo, setUserInfo] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.accessToken) {
      return;
    }

    fetch(`${config.issuer}/oidc/v1/userinfo`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((result) => setUserInfo(result))
      .catch((e) => console.log(e));
  }, [session]);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <>{JSON.stringify(session)}</>

      <br />
      <>-----------------------------</>
      <br />

      <>{JSON.stringify(userInfo)}</>

      <br />
      <>-----------------------------</>
      <br />

      <button
        onClick={() => {
          const scopes = [
            'openid',
            'userinfo',
            'email',
            'profile',
            'address',
            'offline_access',
            'urn:zitadel:iam:user:metadata',
            'urn:zitadel:iam:user:resourceowner',
            'urn:zitadel:iam:org:project:id:zitadel:aud',
          ];

          signIn(
            'zitadel',
            {},
            {
              scope: scopes.join(' '),
            },
          );
        }}
      >
        Login
      </button>

      <button
        onClick={async () => {
          await signOut();
        }}
      >
        Logout
      </button>
    </main>
  );
}
