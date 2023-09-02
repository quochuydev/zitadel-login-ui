import { Inter } from 'next/font/google';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [userInfo, setUserInfo] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    fetch('https://portal.local/oidc/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(async (result) => setUserInfo(result))
      .catch();
  }, [session]);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <>{JSON.stringify(session)}</>

      <br />
      <>-----------------------------</>
      <br />

      <>{JSON.stringify(userInfo)}</>

      <br />
      <button
        onClick={() => {
          const careProviderId = '1dfca9ee-f4ae-4fac-9dd4-49e06f47fe81';
          console.log('careProviderId', careProviderId);

          const mapOrg = {
            '1dfca9ee-f4ae-4fac-9dd4-49e06f47fe81': {
              orgId: '226742452134923939', //adminX
              // loginClient: '226760022309212526', //adminX
              // loginClient: '227893642738577880', //app
              loginClient: '226761232584085870', //zitadel
            },
            '44e54ccf-1307-4df6-9117-609f9e0f2458': {
              orgId: '226760083948752547', //adminY
              // loginClient: '227761428495376237', //adminY
              // loginClient: '227893642738577880', //app
              loginClient: '226761232584085870', //zitadel
            },
          };

          if (!mapOrg[careProviderId]) {
            console.log('Invalid data');
            return;
          }

          const config = mapOrg[careProviderId];

          const options = {
            login_client: config.loginClient,
            scope: `openid userinfo email profile address urn:zitadel:iam:user:metadata urn:zitadel:iam:user:resourceowner urn:zitadel:iam:org:id:${config.orgId}`,
          };

          signIn('zitadel', {}, options);
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
