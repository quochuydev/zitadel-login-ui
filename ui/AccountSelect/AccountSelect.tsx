/* eslint-disable max-len */
'use client';
import React from 'react';
import ApiService from '#/services/frontend/api.service';
import { ROUTING } from '#/lib/router';
import type { AuthRequest, Session } from '#/types/zitadel';
import useTranslations from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { objectToQueryString } from '#/lib/api-caller';

export default (props: {
  appUrl: string;
  sessions: Session[];
  authRequest?: AuthRequest;
}) => {
  const { appUrl, sessions, authRequest } = props;
  const router = useRouter();
  const { t } = useTranslations('account_select');
  const apiService = ApiService({ appUrl });

  const formatDisplayText = (text?: string, length = 25) => {
    if (!text) return t('empty');
    return text?.length ? text.substring(0, length) : text;
  };

  return (
    <div className="flex flex-col bg-white w-screen h-screen">
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white w-[416px] py-4 rounded-md shadow-md">
          <div className="flex flex-col items-center justify-center text-center p-2">
            <Image
              src="/images/company.png"
              alt="logo"
              width={100}
              height="75"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {t('accountSelectTitle')}
              </h2>
            </div>
          </div>

          <div>
            {[...sessions]
              .filter((e) => !!e.factors?.user?.id)
              .map((session) => (
                <div
                  key={session.id}
                  className="flex items-center p-2 mb-4 hover:bg-gray-100 hover:cursor-pointer"
                  onClick={async () => {
                    try {
                      if (authRequest && session?.factors?.user?.id) {
                        const result = await apiService.finalizeAuthRequest({
                          authRequestId: authRequest.id,
                          userId: session.factors.user.id,
                        });

                        if (result.callbackUrl) {
                          router.replace(result.callbackUrl);
                          return;
                        }
                      }

                      const index = sessions.findIndex(
                        (e) => e.id === session.id,
                      );
                      router.push(`${ROUTING.ACCOUNT}/${index}`);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-full mr-4 ring-2">
                    <div className="text-center">
                      {session
                        ? session.factors?.user?.displayName?.substring(0, 1)
                        : 'A'}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {formatDisplayText(session.factors?.user?.displayName)}
                    </h3>
                    <p className="text-gray-600">
                      {formatDisplayText(session.factors?.user?.loginName)}
                    </p>
                  </div>
                </div>
              ))}

            <div
              className="flex items-center p-4 hover:bg-gray-100 hover:cursor-pointer"
              onClick={() => {
                router.push(
                  objectToQueryString(ROUTING.LOGIN, {
                    authRequest: authRequest?.id,
                  }),
                );
              }}
            >
              <p>{t('addAccount')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
