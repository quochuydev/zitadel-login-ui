'use client';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { ROUTING } from '#/lib/router';
import { getOrgIdFromAuthRequest } from '#/lib/zitadel';
import ApiService from '#/services/frontend/api.service';
import type { APIRegister } from '#/types/api';
import type { AuthRequest } from '#/types/zitadel';
import RegisterForm from '#/ui/Register/components/RegisterForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export type RegisterParams = {
  username: string;
  email: string;
  familyName: string;
  givenName: string;
  password: string;
};

const RegisterPage = (props: { appUrl: string; authRequest?: AuthRequest }) => {
  const { appUrl, authRequest } = props;
  const [isLoading, setIsLoading] = useState(false);
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const router = useRouter();
  const orgId = getOrgIdFromAuthRequest(authRequest);

  const handleRegisterForm = async (params: RegisterParams) => {
    setIsLoading(true);
    const { username, email, familyName, givenName, password } = params;

    try {
      const result = await apiService.request<APIRegister>({
        url: '/api/register',
        method: 'post',
        data: {
          orgId,
          username,
          email,
          familyName,
          givenName,
          password,
          authRequestId: authRequest?.id,
        },
      });

      if (!result || !result.userId) throw result;

      router.replace(result.callbackUrl || ROUTING.HOME);
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
          <Image src="/images/company.png" alt="logo" width="125" height="47" />
          <h2 className="mb-[24px] mt-6 text-center text-3xl font-extrabold text-gray-900">
            👋 Register!
          </h2>
        </div>

        <div className="m-5 flex max-w-7xl flex-col lg:m-0 py-4">
          <RegisterForm
            loading={isLoading}
            handleRegisterForm={handleRegisterForm}
          />
        </div>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default RegisterPage;
