'use client';

import { ROUTING } from '#/lib/router';
import type { Session } from '#/types/zitadel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProfileImage from './components/ProfileImage';

export default (props: {
  appUrl: string;
  sessions: Session[];
  activeSession: Session;
  index: number;
}) => {
  const { appUrl, sessions, activeSession, index } = props;
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen flex-col bg-white">
      <div className="relative bg-white">
        <nav aria-label="Top" className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="ml-auto flex items-center">
              <ProfileImage
                appUrl={appUrl}
                onSelectAccount={(session: Session) => {
                  try {
                    const index = sessions.findIndex(
                      (e) => e.id === session.id,
                    );

                    router.push(`${ROUTING.ACCOUNT}/${index}`);
                  } catch (error) {
                    console.error(error);
                  }
                }}
                session={activeSession}
                sessions={sessions}
              />
            </div>
          </div>
        </nav>
      </div>

      <div className="flex flex-grow items-center justify-center">
        <div className="flex w-[480px] lg:p-[40px] flex-col items-center justify-center rounded-[8px] border-gray-300 md:border">
          <h1 className="text-[42px]">👋 Welcome!</h1>

          <pre className="hidden">{JSON.stringify(activeSession, null, 2)}</pre>

          <Image
            width={100}
            height={100}
            src="/images/user.png"
            alt="avatar"
            className="mb-[16px] mt-[40px] rounded-full"
          />

          <h3 className="text-[18px]">
            {activeSession?.factors?.user?.displayName}
          </h3>

          <a
            className="text-[12px] font-normal text-[#4F6679] cursor-pointer mt-[20px]"
            onClick={() => router.replace(`/account/${index}/passkeys`)}
          >
            Register passkeys
          </a>

          <a
            className="text-[12px] font-normal text-[#4F6679] cursor-pointer mt-[20px]"
            onClick={() => router.replace(`/account/${index}/totp`)}
          >
            Add MFA
          </a>

          <a
            className="text-[12px] font-normal text-[#4F6679] cursor-pointer mt-[20px]"
            onClick={() => router.replace(`/account/${index}/password`)}
          >
            Change password
          </a>
        </div>
      </div>
    </div>
  );
};
