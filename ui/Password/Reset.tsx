'use client';
import LoadingState from '#/components/Loading';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { ROUTING } from '#/lib/router';
import ApiService from '#/services/frontend/api.service';
import { APIRequestCode } from '#/types/api';
import { AuthRequest } from '#/types/zitadel';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import React, { useRef, useState } from 'react';

const PasswordResetPage = (props: {
  appUrl: string;
  authRequest?: AuthRequest;
}) => {
  const { appUrl, authRequest } = props;
  const [isLoading, setIsLoading] = useState(false);
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const [username, setUsername] = useState('');
  const [sent, setSent] = useState(false);
  const { t } = useTranslation('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || isLoading) return;

    setIsLoading(true);

    try {
      await apiService.request<APIRequestCode>({
        url: '/api/users/request-code',
        method: 'post',
        data: {
          username,
        },
      });

      setSent(true);
      toastRef.current?.show({
        message: t('PASSWORD_RESET_SENT'),
        intent: 'success',
      });
    } catch (error) {
      console.log(`debug:error`, error);

      toastRef.current?.show({
        message: t('SOMETHING_WENT_WRONG'),
        intent: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const backHref = authRequest?.id
    ? `${ROUTING.LOGIN}?authRequest=${authRequest.id}`
    : ROUTING.LOGIN;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-8 sm:py-12">
      <LoadingState loading={isLoading} />

      <div className="w-full max-w-[440px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="relative mb-6 flex items-center justify-center">
          <Link
            href={backHref}
            aria-label={t('BACK')}
            className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            {t('PASSWORD_RESET_TITLE')}
          </h1>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="mb-2 text-base font-medium text-gray-900">
              {t('PASSWORD_RESET_SENT')}
            </p>
            <p className="mb-6 text-sm text-gray-600">
              {t('PASSWORD_RESET_SENT_HINT')}
            </p>
            <Link
              href={backHref}
              className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {t('BACK_TO_LOGIN')}
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-center text-sm text-gray-600">
              {t('PASSWORD_RESET_HINT')}
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  {t('USERNAME')}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="username"
                  inputMode="email"
                  required
                  className="appearance-none block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
                  placeholder={t('USERNAME_PLACEHOLDER')}
                  value={username}
                  disabled={isLoading}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="mt-2 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!username.trim() || isLoading}
              >
                {isLoading ? t('LOADING') : t('SEND_RESET_LINK')}
              </button>
            </form>
          </>
        )}
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default PasswordResetPage;
