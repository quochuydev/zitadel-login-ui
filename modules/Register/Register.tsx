'use client';
import {
  getOrgIdFromAuthRequest,
  getProjectIdFromAuthRequest,
} from '#/helpers/zitadel';
import type { ToastType } from '#/modules/Components/Toast';
import Toast from '#/modules/Components/Toast';
import RegisterForm from '#/modules/Register/components/RegisterForm';
import ApiService from '#/services/frontend/api.service';
import type { APIRegister } from '#/types/api';
import { ROUTING } from '#/types/router';
import type { AuthRequest } from '#/types/zitadel';
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

  const projectId = getProjectIdFromAuthRequest(authRequest);
  const orgId = getOrgIdFromAuthRequest(authRequest);

  const handleRegisterForm = async (registerParams: RegisterParams) => {
    const { email, familyName, givenName, password } = registerParams;
    setIsLoading(true);

    try {
      if (!orgId) throw new Error('Invalid orgId');

      const result = await apiService.request<APIRegister>({
        url: '/api/register',
        method: 'post',
        data: {
          orgId,
          familyName,
          givenName,
          email,
          password,
          projectId,
          authRequestId: authRequest?.id,
        },
      });

      if (!result || !result.userId) {
        throw result;
      }

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

  if (!orgId) {
    return (
      <div>
        <p>Registration not allowed</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center align-middle">
      <div className="mb-[8px] ml-[30px] mr-[30px] flex h-full w-full flex-col justify-center rounded-md border-gray-300 lg:h-[600px] lg:w-[480px] lg:border lg:p-[80px]">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/images/company.png"
            alt="logo"
            width="125"
            height="47"
          />
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
