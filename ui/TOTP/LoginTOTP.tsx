'use client';
import LoadingState from '#/components/Loading';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { arrayBufferToString, coerceToArrayBuffer } from '#/lib/bytes';
import { ROUTING } from '#/lib/router';
import ApiService from '#/services/frontend/api.service';
import { APILoginTOTP, APIStartTOTP } from '#/types/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const LoginTOTP = (props: { appUrl: string }) => {
  const { appUrl } = props;
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>('');

  async function loginWithTOTP() {
    setIsLoading(true);

    try {
      const session = await apiService.request<APIStartTOTP>({
        url: '/api/totp/start',
        method: 'post',
        data: {
          username,
        },
      });

      const result = await apiService.request<APILoginTOTP>({
        url: '/api/totp/login',
        method: 'post',
        data: {
          username,
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
      <LoadingState loading={isLoading} />

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
          onClick={() => loginWithTOTP()}
          type="button"
          className="disabled:bg-gray-300 group relative w-full flex justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Log in with totp
        </button>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default LoginTOTP;
