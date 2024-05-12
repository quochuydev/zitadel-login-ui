/* eslint-disable max-len */
'use client';
import React, { useRef } from 'react';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import useTranslations from 'next-translate/useTranslation';
import Button from '#/components/Button/Button';
import { useRouter } from 'next/navigation';
import { ROUTING } from '#/types/router';

export default function LoginExternalFail() {
  const toastRef = useRef<ToastType>();
  const { t } = useTranslations('common');
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col h-full w-full items-center justify-center">
      <div className="max-w-lg w-full justify-center rounded-md">
        <div className="flex flex-col w-full justify-center items-center my-[80px]">
          <p>{t('SOMETHING_WENT_WRONG')}</p>

          <Button.Primary
            color="blue"
            text={t('LOG_IN')}
            fullWidth={false}
            onClick={() => router.replace(ROUTING.LOGIN)}
          />
        </div>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
}
