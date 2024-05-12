'use client';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { coerceToArrayBuffer, coerceToBase64Url } from '#/helpers/bytes';
import ApiService from '#/services/frontend/api.service';
import { APIVerifyPasskey } from '#/types/api';
import Image from 'next/image';
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

  const verifyPasskey = async () => {
    if (passkeyId && publicKeyCredentialCreationOptions) {
      try {
        publicKeyCredentialCreationOptions.publicKey.challenge =
          coerceToArrayBuffer(
            publicKeyCredentialCreationOptions.publicKey.challenge,
            'challenge',
          );

        publicKeyCredentialCreationOptions.publicKey.user.id =
          coerceToArrayBuffer(
            publicKeyCredentialCreationOptions.publicKey.user.id,
            'userid',
          );

        if (publicKeyCredentialCreationOptions.publicKey.excludeCredentials) {
          publicKeyCredentialCreationOptions.publicKey.excludeCredentials.map(
            (cred: any) => {
              cred.id = coerceToArrayBuffer(
                cred.id as string,
                'excludeCredentials.id',
              );
              return cred;
            },
          );
        }

        const credential = await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions.publicKey,
        });
        if (!credential) throw new Error('invalid credential');

        console.log('credential', credential);

        const attestationObject = (credential as any).response
          .attestationObject;
        const clientDataJSON = (credential as any).response.clientDataJSON;
        const rawId = (credential as any).rawId;

        const data = {
          id: credential.id,
          rawId: coerceToBase64Url(rawId, 'rawId'),
          type: credential.type,
          response: {
            attestationObject: coerceToBase64Url(
              attestationObject,
              'attestationObject',
            ),
            clientDataJSON: coerceToBase64Url(clientDataJSON, 'clientDataJSON'),
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
      } catch (error) {
        console.log('debug', error);
      }
    }
  };

  const [username, setUsername] = useState<string>(loginName);

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
          <p>{loginName}</p>

          <div className="my-4 ">
            <button
              onClick={() => verifyPasskey()}
              type="button"
              className="disabled:bg-gray-300 group relative w-full flex justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register passkeys
            </button>
          </div>
        </div>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default RegisterPasskeysPage;
