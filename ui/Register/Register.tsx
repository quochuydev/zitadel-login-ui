'use client';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { ROUTING } from '#/helpers/router';
import { getOrgIdFromAuthRequest } from '#/helpers/zitadel';
import ApiService from '#/services/frontend/api.service';
import type { APIRegister } from '#/types/api';
import type { AuthRequest } from '#/types/zitadel';
import RegisterForm from '#/ui/Register/components/RegisterForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export type RegisterParams = {
  familyName: string;
  givenName: string;
  email: string;
  password: string;
};

const RegisterPage = (props: { appUrl: string; authRequest?: AuthRequest }) => {
  const { appUrl, authRequest } = props;
  const [isLoading, setIsLoading] = useState(false);
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const router = useRouter();
  const orgId = getOrgIdFromAuthRequest(authRequest);

  const handleRegisterForm = async (registerParams: RegisterParams) => {
    const { email, familyName, givenName, password } = registerParams;
    setIsLoading(true);

    try {
      const result = await apiService.request<APIRegister>({
        url: '/api/register',
        method: 'post',
        data: {
          orgId,
          familyName,
          givenName,
          email,
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
      <div className="flex h-full w-full flex-col justify-center rounded-md border-gray-300 lg:h-[600px] lg:w-[480px] lg:border p-5">
        <div className="flex flex-col items-center justify-center">
          <Image src="/images/company.png" alt="logo" width="125" height="47" />
          <h2 className="mb-[24px] mt-6 text-center text-3xl font-extrabold text-gray-900">
            👋 Register!
          </h2>
        </div>

        <div className="m-5 flex max-w-7xl flex-col lg:m-0">
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
