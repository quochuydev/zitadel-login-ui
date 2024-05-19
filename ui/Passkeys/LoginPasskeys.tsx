'use client';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { coerceToArrayBuffer, coerceToBase64Url } from '#/helpers/bytes';
import { ROUTING } from '#/helpers/router';
import ApiService from '#/services/frontend/api.service';
import { APILoginPasskey, APIStartPasskey } from '#/types/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import LoadingState from '#/components/Loading';

const LoginPasskeysPage = (props: { appUrl: string }) => {
  const { appUrl } = props;
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>('');

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

      const authData = new Uint8Array(
        assertedCredential.response.authenticatorData,
      );
      const clientDataJSON = new Uint8Array(
        assertedCredential.response.clientDataJSON,
      );
      const rawId = new Uint8Array(assertedCredential.rawId);
      const sig = new Uint8Array(assertedCredential.response.signature);
      const userHandle = new Uint8Array(assertedCredential.response.userHandle);

      const data = {
        id: assertedCredential.id,
        rawId: coerceToBase64Url(rawId),
        type: assertedCredential.type,
        response: {
          authenticatorData: coerceToBase64Url(authData),
          clientDataJSON: coerceToBase64Url(clientDataJSON),
          signature: coerceToBase64Url(sig),
          userHandle: coerceToBase64Url(userHandle),
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
        message: 'Something wrong',
        intent: 'error',
      });

      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center align-middle">
      <LoadingState />

      <div className="flex w-full flex-col justify-center rounded-md border-gray-300 lg:w-[480px] min-h-[480px] lg:border p-5">
        <Image
          src="/images/company.png"
          alt="logo"
          width="125"
          height="47"
          className="self-center"
        />

        <h2 className="mb-[24px] mt-6 text-center text-3xl font-extrabold text-gray-900">
          👋 Welcome!
        </h2>

        <input
          autoFocus
          name="username"
          required
          className="appearance-none rounded-[8px] relative block w-full px-3 py-2 mb-5 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Username"
          value={username}
          disabled={false}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={() => loginWithPasskey()}
          type="button"
          className="disabled:bg-gray-300 group relative w-full flex justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Log in with passkey
        </button>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default LoginPasskeysPage;
