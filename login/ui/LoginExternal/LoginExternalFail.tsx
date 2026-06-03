/* eslint-disable max-len */
'use client';
import { Button } from '#/components/ui/button';
import { ROUTING } from '#/lib/router';
import useTranslations from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';

export default function LoginExternalFail() {
  const { t } = useTranslations('common');
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col h-full w-full items-center justify-center">
      <div className="max-w-lg w-full justify-center rounded-md">
        <div className="flex flex-col w-full justify-center items-center my-[80px]">
          <p>{t('SOMETHING_WENT_WRONG')}</p>

          <Button
            className="mt-6"
            onClick={() => router.replace(ROUTING.LOGIN)}
          >
            {t('auth:LOG_IN')}
          </Button>
        </div>
      </div>
    </div>
  );
}
