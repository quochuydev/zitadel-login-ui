'use client';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import ApiService from '#/services/frontend/api.service';
import { APIStartTOTP, APIVerifyTOTP } from '#/types/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useRef } from 'react';
import QRCode from 'qrcode.react';

const RegisterTOTP = (props: {
  appUrl: string;
  orgId: string;
  userId: string;
  loginName: string;
}) => {
  const { appUrl, orgId, userId, loginName } = props;
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const router = useRouter();
  const [qrCode, setQrCode] = React.useState<string | undefined>(undefined);
  const [verifyCode, setVerifyCode] = React.useState<string>('');

  const registerTOTP = async () => {
    try {
      const result = await apiService.request<APIStartTOTP>({
        url: '/api/totp/start',
        method: 'post',
        data: {
          orgId,
          userId,
        },
      });

      if (result.uri) setQrCode(result.uri);
    } catch (error) {
      console.log('debug', error);

      toastRef.current?.show({
        message: 'failed',
        intent: 'error',
      });
    }
  };

  const verifyTOTP = async () => {
    try {
      await apiService.request<APIVerifyTOTP>({
        url: '/api/totp/verify',
        method: 'post',
        data: {
          orgId,
          userId,
          code: verifyCode,
        },
      });

      toastRef.current?.show({
        message: 'successfully',
        intent: 'success',
      });

      setQrCode(undefined);
    } catch (error) {
      console.log('debug', error);

      toastRef.current?.show({
        message: 'failed',
        intent: 'error',
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center align-middle">
      <div className="flex w-full flex-col items-center justify-center rounded-md border-gray-300 lg:w-[480px] min-h-[480px] lg:border p-5">
        <Image src="/images/company.png" alt="logo" width="75" height="47" />

        <h2 className="mb-[24px] mt-6 text-center text-3xl font-extrabold text-gray-900">
          👋 Welcome!
        </h2>

        <p>{loginName}</p>

        <button
          onClick={() => registerTOTP()}
          type="button"
          className="my-4 disabled:bg-gray-300 group relative flex justify-center p-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register totp
        </button>

        {qrCode && <QRCode size={200} value={qrCode} className="my-4" />}

        <div className="flex gap-2">
          <input
            id="password"
            type={'text'}
            required
            className="appearance-none rounded-[8px] relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="verifyCode"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
          />
          <button
            onClick={() => verifyTOTP()}
            type="button"
            className="disabled:bg-gray-300 group relative flex justify-center p-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify
          </button>
        </div>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default RegisterTOTP;
