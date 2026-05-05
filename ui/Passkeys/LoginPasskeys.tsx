'use client';
import LoadingState from '#/components/Loading';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { arrayBufferToString, coerceToArrayBuffer } from '#/lib/bytes';
import { ROUTING } from '#/lib/router';
import ApiService from '#/services/frontend/api.service';
import { APILoginPasskey, APIStartPasskey } from '#/types/api';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const LoginPasskeysPage = (props: { appUrl: string }) => {
  const { appUrl } = props;
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>('');
  const { t } = useTranslation('common');

  async function loginWithPasskey() {
    setIsLoading(true);

    try {
      const session = await apiService.request<APIStartPasskey>({
        url: '/api/passkey/start',
        method: 'post',
        data: {
          username,
          challenges: {
            webAuthN: {
              domain: new URL(appUrl).hostname, //localhost
              userVerificationRequirement:
                'USER_VERIFICATION_REQUIREMENT_REQUIRED',
            },
          },
        },
      });

      const publicKeyCredentialRequestOptions =
        session.challenges.webAuthN.publicKeyCredentialRequestOptions;

      publicKeyCredentialRequestOptions.publicKey.challenge =
        coerceToArrayBuffer(
          publicKeyCredentialRequestOptions.publicKey.challenge,
        );

      publicKeyCredentialRequestOptions.publicKey.allowCredentials.map(
        (listItem: any) => {
          listItem.id = coerceToArrayBuffer(listItem.id);
        },
      );

      const assertedCredential: any = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions.publicKey,
      });

      if (!assertedCredential) throw new Error('invalid credential');

      const rawId = arrayBufferToString(assertedCredential.rawId);
      const signature = arrayBufferToString(
        assertedCredential.response.signature,
      );
      const userHandle = arrayBufferToString(
        assertedCredential.response.userHandle,
      );
      const authenticatorData = arrayBufferToString(
        assertedCredential.response.authenticatorData,
      );
      const clientDataJSON = arrayBufferToString(
        assertedCredential.response.clientDataJSON,
      );

      const data = {
        id: assertedCredential.id,
        type: assertedCredential.type,
        rawId,
        response: {
          authenticatorData,
          clientDataJSON,
          signature,
          userHandle,
        },
      };

      const result = await apiService.request<APILoginPasskey>({
        url: '/api/passkey/login',
        method: 'post',
        data: {
          username,
          webAuthN: {
            credentialAssertionData: data,
          },
        },
      });

      console.log(`debug:result`, result);

      router.replace(ROUTING.HOME);
    } catch (error) {
      console.error(error);

      toastRef.current?.show({
        message: t('SOMETHING_WENT_WRONG'),
        intent: 'error',
      });

      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-8 sm:py-12">
      <LoadingState loading={isLoading} />

      <div className="w-full max-w-[440px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="relative mb-6 flex items-center justify-center">
          <Link
            href={ROUTING.LOGIN}
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
            {t('PASSKEY_LOGIN_TITLE')}
          </h1>
        </div>

        <p className="mb-6 text-center text-sm text-gray-600">
          {t('PASSKEY_LOGIN_HINT')}
        </p>

        <div className="space-y-4">
          <div>
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
              autoComplete="username webauthn"
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
            onClick={() => loginWithPasskey()}
            type="button"
            disabled={isLoading || !username.trim()}
            className="mt-2 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? t('LOADING') : t('LOG_IN_WITH_PASSKEY')}
          </button>
        </div>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default LoginPasskeysPage;
