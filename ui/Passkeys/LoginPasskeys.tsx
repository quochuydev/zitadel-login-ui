'use client';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { coerceToArrayBuffer, coerceToBase64Url } from '#/helpers/bytes';
import ApiService from '#/services/frontend/api.service';
import { APIWebAuthNLogin, APIWebAuthNStart } from '#/types/api';
import Image from 'next/image';
import { useRef, useState } from 'react';

const PasskeysPage = (props: { appUrl: string }) => {
  const { appUrl } = props;
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();

  const [username, setUsername] = useState<string>('');

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center align-middle">
      <div className="mb-[8px] ml-[30px] mr-[30px] flex h-full w-full flex-col justify-center rounded-md border-gray-300 lg:h-[484px] lg:w-[480px] lg:border lg:p-[80px]">
        <div className="flex flex-col items-center justify-center">
          <Image src="/images/company.png" alt="logo" width="125" height="47" />

          <h2 className="mb-[24px] mt-6 text-center text-3xl font-extrabold text-gray-900">
            👋 Welcome!
          </h2>
        </div>

        <div className="m-5 flex max-w-7xl flex-col lg:m-0">
          <input
            autoFocus
            name="username"
            required
            className="appearance-none rounded-[8px] relative block w-full px-3 py-2 mb-[24px] border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Username"
            value={username}
            disabled={false}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="my-4 ">
            <button
              onClick={async (e) => {
                e.preventDefault();

                const session = await apiService.request<APIWebAuthNStart>({
                  url: '/api/webAuthN/start',
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

                console.log(
                  'publicKeyCredentialRequestOptions',
                  publicKeyCredentialRequestOptions,
                );

                publicKeyCredentialRequestOptions.publicKey.challenge =
                  coerceToArrayBuffer(
                    publicKeyCredentialRequestOptions.publicKey.challenge,
                    'challenge',
                  );

                publicKeyCredentialRequestOptions.publicKey.allowCredentials.map(
                  (listItem: any) => {
                    listItem.id = coerceToArrayBuffer(
                      listItem.id,
                      'publicKey.allowCredentials.id',
                    );
                  },
                );

                const assertedCredential = await navigator.credentials.get({
                  publicKey: publicKeyCredentialRequestOptions.publicKey,
                });

                if (!assertedCredential) throw new Error('invalid credential');
                console.log('assertedCredential', assertedCredential);

                const authData = new Uint8Array(
                  assertedCredential.response.authenticatorData,
                );
                const clientDataJSON = new Uint8Array(
                  assertedCredential.response.clientDataJSON,
                );
                const rawId = new Uint8Array(assertedCredential.rawId);
                const sig = new Uint8Array(
                  assertedCredential.response.signature,
                );
                const userHandle = new Uint8Array(
                  assertedCredential.response.userHandle,
                );

                const data = {
                  id: assertedCredential.id,
                  rawId: coerceToBase64Url(rawId, 'rawId'),
                  type: assertedCredential.type,
                  response: {
                    authenticatorData: coerceToBase64Url(authData, 'authData'),
                    clientDataJSON: coerceToBase64Url(
                      clientDataJSON,
                      'clientDataJSON',
                    ),
                    signature: coerceToBase64Url(sig, 'sig'),
                    userHandle: coerceToBase64Url(userHandle, 'userHandle'),
                  },
                };

                const result = await apiService.request<APIWebAuthNLogin>({
                  url: '/api/webAuthN/login',
                  method: 'post',
                  data: {
                    username,
                    webAuthN: {
                      credentialAssertionData: data,
                    },
                  },
                });

                console.log(`debug:result`, result);
              }}
              type="button"
              className="disabled:bg-gray-300 group relative w-full flex justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </div>
        </div>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default PasskeysPage;
