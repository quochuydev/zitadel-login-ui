'use client';
import Toast, { ToastType } from '#/components/Toast';
import { ROUTING } from '#/lib/router';
import ApiService from '#/services/frontend/api.service';
import { APIExternalRegister } from '#/types/api';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ExternalRegisterParams } from '../Register/components/ExternalRegisterForm';
import ExternalRegisterForm from '../Register/components/ExternalRegisterForm';

export default function LoginExternalUserNotExisting(props: any) {
  const {
    appUrl,
    familyName,
    givenName,
    email,
    username,
    idpLink,
    idpIntentId,
    idpIntentToken,
  } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();

  const handleRegisterForm = async (params: ExternalRegisterParams) => {
    setIsLoading(true);

    try {
      if (!idpLink.idpId && !idpLink.userId && !idpLink.userName) {
        throw new Error('Invalid idpLink');
      }

      const result = await apiService.request<APIExternalRegister>({
        url: '/api/external/register',
        method: 'post',
        data: {
          idpIntentId,
          idpIntentToken,
          email: params.email,
          username: params.username,
          givenName: params.givenName,
          familyName: params.familyName,
          idpLink,
        },
      });

      if (!result?.userId) throw result;

      router.replace(ROUTING.HOME);
    } catch (error) {
      console.error(error);

      toastRef.current?.show({
        message: 'Register error',
        intent: 'error',
      });

      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center align-middle">
      <div className="flex w-full flex-col justify-center rounded-md border-gray-300 lg:w-[480px] lg:border p-5">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-[24px] mt-6 text-center text-3xl font-extrabold text-gray-900">
            👋 Register!
          </h2>
        </div>

        <div className="m-5 flex max-w-7xl flex-col lg:m-0 py-4">
          <ExternalRegisterForm
            defaultValues={{
              username,
              email,
              familyName,
              givenName,
            }}
            loading={isLoading}
            handleRegisterForm={handleRegisterForm}
          />
        </div>

        {idpLink && (
          <div className="border border-gray-300 rounded-md py-2 px-8 mt-5">
            <p>userId: {idpLink.userId}</p>
            <p>userName: {idpLink.userName}</p>
            <p>idpId: {idpLink.idpId}</p>
          </div>
        )}
      </div>

      <Toast ref={toastRef} />
    </div>
  );
}
