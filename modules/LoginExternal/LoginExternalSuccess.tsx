'use client';
import React, { useEffect, useState } from 'react';
import ApiService from '#/services/frontend/api.service';
import { ROUTING } from '#/types/router';
import useTranslations from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';

type LoginExternalSuccessProps = {
  appUrl: string;
  userId: string;
  authRequestId: string;
  idpIntentId: string;
  idpIntentToken: string;
};

export default function LoginExternalSuccess(props: LoginExternalSuccessProps) {
  const { appUrl, userId, authRequestId, idpIntentId, idpIntentToken } = props;
  const apiService = ApiService({ appUrl });
  const router = useRouter();
  const [loginExternalCompleted, setLoginExternalCompleted] = useState(false);
  const [finalizeCompleted, setFinalizeCompleted] = useState(false);
  const { t } = useTranslations('common');

  const loginExternal = async () => {
    try {
      await apiService.loginExternal({
        idpIntentId,
        idpIntentToken,
        userId,
      });

      setLoginExternalCompleted(true);

      const result = await apiService.finalizeAuthRequest({
        authRequestId,
        userId,
      });

      setFinalizeCompleted(true);

      router.replace(result.callbackUrl || ROUTING.HOME);
    } catch (e) {
      console.log(`debug:e`, e);
    }
  };

  useEffect(() => {
    if (userId && authRequestId && idpIntentId && idpIntentToken) {
      loginExternal();
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col w-full h-full items-center justify-center align-middle">
      <div className="flex text-[#9AA7B2]">
        <p
          className={`text-[14px] font-normal ${
            loginExternalCompleted ? 'text-[#028A4B]' : 'text-[#9AA7B2]'
          }`}
        >
          {t('CREATING_SESSION')}
        </p>
      </div>

      <div className="flex text-[#9AA7B2]">
        <p
          className={`text-[14px] font-normal ${
            finalizeCompleted ? 'text-[#028A4B]' : 'text-[#9AA7B2]'
          }`}
        >
          {t('FINALIZING_AUTH_REQUEST')}
        </p>
      </div>
    </div>
  );
}
