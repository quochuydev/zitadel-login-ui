'use client';
import { Input } from '#/components/ui/input';
import { LoadingOverlay } from '#/components/ui/spinner';
import { toast } from 'sonner';
import useTranslation from 'next-translate/useTranslation';
import { ROUTING } from '#/lib/router';
import ApiService from '#/services/api.service';
import type { APIChangePassword, APIFinalizeAuthRequest } from '#/types/api';
import type { Session } from '#/types/zitadel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

const Page = (props: {
  appUrl: string;
  authRequestId: string;
  activeSession: Session;
}) => {
  const { appUrl, authRequestId, activeSession } = props;
  const apiService = ApiService({ appUrl });
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isShowCurPwd, setShowCurPwd] = useState<boolean>(false);
  const [isShowPwd, setShowPwd] = useState<boolean>(false);
  const [isShowConfirmPwd, setShowConfirmPwd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation('common');

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
        toast.error(t('security:MISSING_FIELDS'));
        return;
      }

      await apiService.request<APIChangePassword>({
        url: '/api/users/password',
        method: 'post',
        data: {
          orgId: activeSession.factors.user.organizationId,
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
      toast.success(t('security:PASSWORD_UPDATED'));

      router.replace(ROUTING.HOME);
    } catch (error) {
      toast.error(t('security:PASSWORD_UPDATE_FAILED'));
      setIsLoading(false);
    }
  };

  const guidelines: Array<{ key: string; label: string }> = [
    {
      key: 'character-length',
      label: t('security:GUIDELINE_LENGTH'),
    },
    {
      key: 'character-uppercase',
      label: t('security:GUIDELINE_UPPERCASE'),
    },
    {
      key: 'character-lowercase',
      label: t('security:GUIDELINE_LOWERCASE'),
    },
    {
      key: 'character-special',
      label: t('security:GUIDELINE_NUMBER'),
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
      <LoadingOverlay loading={isLoading} />

      <div className="flex flex-col w-full max-w-lg justify-center rounded-md border-gray-300 lg:border p-5">
        <Image
          src="/images/company.svg"
          alt="logo"
          width="125"
          height="47"
          className="self-center"
        />

        <h2 className="bold my-[24px] text-[18px] self-center">
          {t('security:UPDATE_PASSWORD')}
        </h2>

        <div className="self-center flex items-center justify-center mb-[24px] rounded-[30px] bg-[#E9F8FF]">
          <span
            aria-hidden="true"
            className="m-[5px] mr-3 flex h-[33px] w-[33px] items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
          >
            {(activeSession?.factors?.user?.displayName || 'A')
              .substring(0, 1)
              .toUpperCase()}
          </span>
          <p className="mr-5">{activeSession?.factors?.user?.displayName}</p>
        </div>

        <form onSubmit={handleUpdatePwd}>
          <div className="w-full space-y-px rounded-md shadow-sm">
            <div className="relative">
              <p className="mb-[8px] text-[12px] uppercase text-[#4F6679]">
                {t('security:CURRENT_PASSWORD')}
              </p>
              <Input
                autoFocus={true}
                id="password"
                name="password"
                type={isShowCurPwd ? 'text' : 'password'}
                required
                className="relative mb-[24px] block w-full appearance-none rounded-[8px] rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder={t('security:CURRENT_PASSWORD')}
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
                src={`/images/${isShowCurPwd ? 'eye-off.svg' : 'eye.svg'}`}
              />
            </div>

            <div className="relative">
              <p className="mb-[8px] text-[12px] uppercase text-[#4F6679]">
                {t('security:NEW_PASSWORD')}
              </p>

              <Input
                autoFocus={true}
                id="password"
                name="password"
                type={isShowPwd ? 'text' : 'password'}
                required
                className="relative mb-[24px] block w-full appearance-none rounded-[8px] rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder={t('security:NEW_PASSWORD')}
                value={newPassword}
                disabled={false}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Image
                className="absolute right-[10px] top-[36px] z-10"
                src={`/images/${isShowPwd ? 'eye-off.svg' : 'eye.svg'}`}
                alt="eye"
                width={20}
                height={20}
                onClick={() => setShowPwd(!isShowPwd)}
              />
            </div>

            <div className="relative">
              <p className="mb-[8px] text-[12px] uppercase text-[#4F6679]">
                {t('auth:CONFIRM_PASSWORD')}
              </p>
              <Input
                autoFocus={true}
                id="password"
                name="password"
                type={isShowConfirmPwd ? 'text' : 'password'}
                required
                className="z-1 relative mb-[6px] block w-full appearance-none rounded-[8px] rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder={t('auth:CONFIRM_PASSWORD')}
                value={confirmPassword}
                disabled={false}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Image
                className="absolute right-[10px] top-[36px] z-10"
                src={`/images/${isShowConfirmPwd ? 'eye-off.svg' : 'eye.svg'}`}
                alt="eye"
                width={20}
                height={20}
                onClick={() => setShowConfirmPwd(!isShowConfirmPwd)}
              />
            </div>
          </div>

          <p className="m-0 mb-[6px] mt-[6px] h-[18px] p-0 text-[12px] text-red-500">
            {isPwdNotMatch && t('auth:PASSWORD_CONFIRM_MISMATCH')}
          </p>

          <p className="mb-[8px] text-[12px] uppercase text-[#4F6679]">
            {t('security:PASSWORD_GUIDELINES')}
          </p>
          {guidelines.map((item, index) => {
            const isPassRule = !!pwdGuidelines.includes(item.key);

            return (
              <div key={index} className="flex text-[#9AA7B2]">
                <Image
                  src="/images/check.svg"
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
            {t('UPDATE')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
