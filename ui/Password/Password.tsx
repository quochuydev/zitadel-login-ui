'use client';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import ApiService from '#/services/frontend/api.service';
import type { APIChangePassword, APIFinalizeAuthRequest } from '#/types/api';
import { ROUTING } from '#/types/router';
import type { Session } from '#/types/zitadel';
import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = (props: {
  appUrl: string;
  authRequestId: string;
  activeSession: Session;
}) => {
  const { appUrl, authRequestId, activeSession } = props;
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isShowCurPwd, setShowCurPwd] = useState<boolean>(false);
  const [isShowPwd, setShowPwd] = useState<boolean>(false);
  const [isShowConfirmPwd, setShowConfirmPwd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleUpdatePwd = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword ||
        !activeSession?.factors?.user
      ) {
        toastRef.current?.show({
          message: 'Missing required fields',
          intent: 'error',
        });
        return;
      }

      await apiService.request<APIChangePassword>({
        url: '/api/users/password',
        method: 'post',
        data: {
          userId: activeSession.factors.user.id,
          currentPassword,
          newPassword,
        },
      });

      if (authRequestId) {
        const result = await apiService.request<APIFinalizeAuthRequest>({
          url: '/api/auth_request/finalize',
          method: 'post',
          data: {
            authRequestId,
            userId: activeSession.factors.user.id,
          },
        });

        if (result.callbackUrl) {
          router.replace(result.callbackUrl);
          return;
        }
      }
      toastRef.current?.show({
        message: 'Update password successful',
        intent: 'success',
      });

      router.replace(ROUTING.HOME);
    } catch (error) {
      toastRef.current?.show({
        message: 'Update password fail',
        intent: 'error',
      });
      setIsLoading(false);
    }
  };

  const guidelines: Array<{ key: string; label: string }> = [
    {
      key: 'character-length',
      label: 'At least 8 characters',
    },
    {
      key: 'character-uppercase',
      label: 'At least 1 uppercase letter',
    },
    {
      key: 'character-lowercase',
      label: 'At least 1 lowercase letter',
    },
    {
      key: 'character-special',
      label: 'At least 1 number',
    },
  ];

  const pwdGuidelines = React.useMemo(() => {
    const keys = [];
    if (newPassword.length >= 8) keys.push('character-length');
    if (/[A-Z]+/.test(newPassword)) keys.push('character-uppercase');
    if (/[a-z]+/.test(newPassword)) keys.push('character-lowercase');
    if (/[!@#$%^&*(){}]+/.test(newPassword)) keys.push('character-special');

    return keys;
  }, [newPassword]);

  const isPwdNotMatch = useMemo(
    () => newPassword && confirmPassword && newPassword !== confirmPassword,
    [newPassword, confirmPassword],
  );

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
      <div className="w-full max-w-lg justify-center rounded-md border-gray-300 lg:border">
        <div className="my-[80px] flex w-full flex-col items-center justify-center">
          <Image
            src="/images/company.png"
            alt="logo"
            width="125"
            height="47"
            className="items-center justify-center text-center"
          />
          <h2 className="bold mb-[24px] mt-[48px] text-[18px]">
            Update password
          </h2>
          <div className="mb-[24px] flex items-center justify-center rounded-[30px] bg-[#E9F8FF]">
            <Image
              width={33}
              height={33}
              src="/images/user.png"
              alt="avatar"
              className="mr-3 rounded-full"
            />
            <p className="mr-5">{activeSession?.factors?.user?.displayName}</p>
          </div>

          <form onSubmit={handleUpdatePwd}>
            <div className="w-[320px] space-y-px rounded-md shadow-sm">
              <div className="relative">
                <p className="mb-[8px] text-[12px] text-[#4F6679]">
                  CURRENT PASSWORD
                </p>
                <input
                  autoFocus={true}
                  id="password"
                  name="password"
                  type={isShowCurPwd ? 'text' : 'password'}
                  required
                  className="relative mb-[24px] block w-full appearance-none rounded-[8px] rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Current password"
                  value={currentPassword}
                  disabled={false}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Image
                  className="absolute right-[10px] top-[36px] z-10"
                  alt="eye"
                  width={20}
                  height={20}
                  onClick={() => setShowCurPwd(!isShowCurPwd)}
                  src={`/images/${isShowCurPwd ? 'eye-off.png' : 'eye.png'}`}
                />
              </div>

              <div className="relative">
                <p className="mb-[8px] text-[12px] text-[#4F6679]">
                  NEW PASSWORD
                </p>

                <input
                  autoFocus={true}
                  id="password"
                  name="password"
                  type={isShowPwd ? 'text' : 'password'}
                  required
                  className="relative mb-[24px] block w-full appearance-none rounded-[8px] rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="New password"
                  value={newPassword}
                  disabled={false}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Image
                  className="absolute right-[10px] top-[36px] z-10"
                  src={`/images/${isShowPwd ? 'eye-off.png' : 'eye.png'}`}
                  alt="eye"
                  width={20}
                  height={20}
                  onClick={() => setShowPwd(!isShowPwd)}
                />
              </div>

              <div className="relative">
                <p className="mb-[8px] text-[12px] text-[#4F6679]">
                  CONFIRM PASSWORD
                </p>
                <input
                  autoFocus={true}
                  id="password"
                  name="password"
                  type={isShowConfirmPwd ? 'text' : 'password'}
                  required
                  className="z-1 relative mb-[6px] block w-full appearance-none rounded-[8px] rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  disabled={false}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Image
                  className="absolute right-[10px] top-[36px] z-10"
                  src={`/images/${
                    isShowConfirmPwd ? 'eye-off.png' : 'eye.png'
                  }`}
                  alt="eye"
                  width={20}
                  height={20}
                  onClick={() => setShowConfirmPwd(!isShowConfirmPwd)}
                />
              </div>
            </div>

            <p className="m-0 mb-[6px] mt-[6px] h-[18px] p-0 text-[12px] text-red-500">
              {isPwdNotMatch && 'Password is not match'}
            </p>

            <p className="mb-[8px] text-[12px] text-[#4F6679]">
              PASSWORD GUIDELINES
            </p>
            {guidelines.map((item, index) => {
              const isPassRule = !!pwdGuidelines.includes(item.key);

              return (
                <div key={index} className="flex text-[#9AA7B2]">
                  <Image
                    src="/images/check.png"
                    alt="check"
                    width={20}
                    height={20}
                    className="mr-[10px]"
                  />
                  <p
                    className={`text-[12px] font-normal  ${
                      isPassRule ? 'text-[#028A4B]' : 'text-[#9AA7B2]'
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              );
            })}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-[24px] flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300"
            >
              Update
            </button>
          </form>
        </div>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default Page;
