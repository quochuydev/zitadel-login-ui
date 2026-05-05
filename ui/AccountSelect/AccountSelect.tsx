/* eslint-disable max-len */
'use client';
import LoadingState from '#/components/Loading';
import { objectToQueryString } from '#/lib/api-caller';
import { ROUTING } from '#/lib/router';
import ApiService from '#/services/frontend/api.service';
import type { AuthRequest, Session } from '#/types/zitadel';
import useTranslations from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default (props: {
  appUrl: string;
  sessions: Session[];
  authRequest?: AuthRequest;
}) => {
  const { appUrl, sessions, authRequest } = props;
  const router = useRouter();
  const { t } = useTranslations('account_select');
  const apiService = ApiService({ appUrl });
  const [pending, setPending] = useState<string | null>(null);
  const isLoading = pending !== null;

  const formatDisplayText = (text?: string, length = 32) => {
    if (!text) return t('empty');
    return text.length > length ? `${text.substring(0, length)}…` : text;
  };

  const initialOf = (name?: string) =>
    name && name.length ? name.substring(0, 1).toUpperCase() : 'A';

  const activeSessions = sessions.filter((e) => !!e.factors?.user?.id);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <LoadingState loading={isLoading} />

      <div className="w-full max-w-[440px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
          <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            {t('accountSelectTitle')}
          </h1>
        </div>

        <ul className="divide-y divide-gray-100" role="list">
          {activeSessions.map((session) => {
            const displayName = session.factors?.user?.displayName;
            const loginName = session.factors?.user?.loginName;

            return (
              <li key={session.id}>
                <button
                  type="button"
                  disabled={isLoading}
                  className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:px-8"
                  onClick={async () => {
                    setPending(session.id);
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
                      setPending(null);
                    }
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
                  >
                    {initialOf(displayName || loginName)}
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-gray-900">
                      {formatDisplayText(displayName)}
                    </span>
                    <span className="truncate text-xs text-gray-500">
                      {formatDisplayText(loginName)}
                    </span>
                  </span>

                  {pending === session.id ? (
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"
                    />
                  ) : (
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 text-gray-400"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              disabled={isLoading}
              className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:px-8"
              onClick={() => {
                setPending('add');
                router.push(
                  objectToQueryString(ROUTING.LOGIN, {
                    authRequest: authRequest?.id,
                  }),
                );
              }}
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-500"
              >
                {pending === 'add' ? (
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"
                  />
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {t('addAccount')}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
