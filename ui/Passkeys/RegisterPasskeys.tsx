'use client';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { coerceToArrayBuffer, coerceToBase64Url } from '#/lib/bytes';
import { ROUTING } from '#/lib/router';
import ApiService from '#/services/frontend/api.service';
import { APIVerifyPasskey } from '#/types/api';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const RegisterPasskeysPage = (props: {
  appUrl: string;
  passkeyId: string;
  orgId: string;
  userId: string;
  loginName: string;
  publicKeyCredentialCreationOptions: any;
}) => {
  const {
    appUrl,
    passkeyId,
    publicKeyCredentialCreationOptions,
    orgId,
    userId,
    loginName,
  } = props;
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');

  const registerPasskey = async () => {
    if (passkeyId && publicKeyCredentialCreationOptions) {
      setIsLoading(true);
      try {
        publicKeyCredentialCreationOptions.publicKey.challenge =
          coerceToArrayBuffer(
            publicKeyCredentialCreationOptions.publicKey.challenge,
          );

        publicKeyCredentialCreationOptions.publicKey.user.id =
          coerceToArrayBuffer(
            publicKeyCredentialCreationOptions.publicKey.user.id,
          );

        if (publicKeyCredentialCreationOptions.publicKey.excludeCredentials) {
          publicKeyCredentialCreationOptions.publicKey.excludeCredentials.map(
            (cred: any) => {
              cred.id = coerceToArrayBuffer(cred.id as string);
              return cred;
            },
          );
        }

        const credential = await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions.publicKey,
        });

        console.log('credential', credential);
        if (!credential) throw new Error('invalid credential');

        const data = {
          id: credential.id,
          type: credential.type,
          rawId: coerceToBase64Url((credential as any).rawId),
          response: {
            attestationObject: coerceToBase64Url(
              (credential as any).response.attestationObject,
            ),
            clientDataJSON: coerceToBase64Url(
              (credential as any).response.clientDataJSON,
            ),
          },
        };

        await apiService.request<APIVerifyPasskey>({
          url: '/api/passkey/verify',
          method: 'post',
          data: {
            orgId,
            userId,
            passkeyId,
            credential: data,
          },
        });

        router.replace(ROUTING.HOME);
      } catch (error) {
        console.log('debug', error);
        toastRef.current?.show({
          message: t('SOMETHING_WENT_WRONG'),
          intent: 'error',
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[440px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          {t('PASSKEY_REGISTER_TITLE')}
        </h1>

        <p className="mb-6 text-center text-sm text-gray-600">
          {t('PASSKEY_REGISTER_HINT')}
        </p>

        <div className="mb-6 rounded-md bg-gray-50 px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            {t('SIGNED_IN_AS')}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900 break-all">
            {loginName}
          </p>
        </div>

        <button
          onClick={() => registerPasskey()}
          type="button"
          disabled={isLoading}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? t('LOADING') : t('REGISTER_PASSKEY')}
        </button>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default RegisterPasskeysPage;
