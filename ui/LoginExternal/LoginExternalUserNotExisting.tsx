'use client';
import Toast, { ToastType } from '#/components/Toast';
import { ROUTING } from '#/lib/router';
import ApiService from '#/services/frontend/api.service';
import { APIExternalLinkIDP, APIRegister } from '#/types/api';
import useTranslations from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { RegisterParams } from '../Register/Register';
import RegisterForm from '../Register/components/RegisterForm';

export default function LoginExternalUserNotExisting(props: any) {
  const { appUrl, familyName, givenName, email, username, idpLink } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();

  const handleRegisterForm = async (params: RegisterParams) => {
    setIsLoading(true);

    try {
      if (!idpLink.idpId && !idpLink.userId && !idpLink.userName)
        throw new Error('Invalid idpLink');

      const result = await apiService.request<APIRegister>({
        url: '/api/register',
        method: 'post',
        data: params,
      });

      if (!result?.userId) throw result;

      await apiService.request<APIExternalLinkIDP>({
        url: '/api/external/linkIdp',
        method: 'post',
        data: {
          userId: result.userId,
          idpLink: {
            idpId: idpLink.idpId,
            userId: idpLink.userId,
            userName: idpLink.userName,
          },
        },
      });

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
          <RegisterForm
            defaultValues={{
              username,
              email,
              familyName,
              givenName,
              password: '',
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
