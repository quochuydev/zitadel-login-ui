'use client';
import React from 'react';
import Button from '#/components/Button';
import { ROUTING } from '#/helpers/router';
import useTranslations from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';

export default function LoginExternalUserNotExisting() {
  const { t } = useTranslations('common');
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col w-full h-full items-center justify-center align-middle">
      <div className="flex flex-col w-full justify-center items-center">
        <p className={`text-[14px]`}>User not existing</p>

        <Button.Primary
          color="blue"
          text={t('LOG_IN')}
          fullWidth={false}
          onClick={() => router.replace(ROUTING.LOGIN)}
        />
      </div>
    </div>
  );
}
