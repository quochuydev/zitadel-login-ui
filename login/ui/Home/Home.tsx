'use client';

import LanguageSwitcher from '#/components/LanguageSwitcher';
import { Button } from '#/components/ui/button';
import { ROUTING } from '#/lib/router';
import type { Session } from '#/types/zitadel';
import KeyIcon from '@heroicons/react/outline/KeyIcon';
import LockClosedIcon from '@heroicons/react/outline/LockClosedIcon';
import ShieldCheckIcon from '@heroicons/react/outline/ShieldCheckIcon';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import ProfileImage from './components/ProfileImage';

const initialOf = (name?: string) =>
  name && name.length ? name.substring(0, 1).toUpperCase() : 'A';

export default (props: {
  appUrl: string;
  sessions: Session[];
  activeSession: Session;
  index: number;
}) => {
  const { appUrl, sessions, activeSession, index } = props;
  const router = useRouter();
  const { t } = useTranslation('common');

  const displayName = activeSession?.factors?.user?.displayName;
  const loginName = activeSession?.factors?.user?.loginName;

  const shortcuts = [
    {
      key: 'passkeys',
      label: t('security:MANAGE_PASSKEYS'),
      description: t('security:MANAGE_PASSKEYS_HINT'),
      icon: KeyIcon,
      href: `${ROUTING.ACCOUNT}/${index}/security/passkeys`,
    },
    {
      key: 'mfa',
      label: t('security:ADD_MFA'),
      description: t('security:ADD_MFA_HINT'),
      icon: ShieldCheckIcon,
      href: `${ROUTING.ACCOUNT}/${index}/totp`,
    },
    {
      key: 'password',
      label: t('security:CHANGE_PASSWORD'),
      description: t('security:CHANGE_PASSWORD_HINT'),
      icon: LockClosedIcon,
      href: `${ROUTING.ACCOUNT}/${index}/password`,
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav aria-label="Top" className="mx-auto px-3 sm:px-4">
          <div className="flex h-12 items-center">
            <h1 className="text-[16px] font-medium text-gray-900">
              {t('ACCOUNT')}
            </h1>
            <div className="ml-auto flex items-center gap-2">
              <LanguageSwitcher variant="header" />
              <ProfileImage
                appUrl={appUrl}
                onSelectAccount={(session: Session) => {
                  try {
                    const i = sessions.findIndex((e) => e.id === session.id);
                    router.push(`${ROUTING.ACCOUNT}/${i}`);
                  } catch (error) {
                    console.error(error);
                  }
                }}
                session={activeSession}
                sessions={sessions}
              />
            </div>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-[480px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-3xl font-semibold text-white"
            >
              {initialOf(displayName || loginName)}
            </span>

            <h2 className="mt-4 text-2xl font-semibold text-gray-900">
              {displayName
                ? t('security:WELCOME_USER', { name: displayName })
                : t('auth:WELCOME')}
            </h2>
            {loginName && (
              <p className="mt-1 text-sm text-gray-500">{loginName}</p>
            )}

            <Button
              className="mt-6 w-full"
              onClick={() =>
                router.push(`${ROUTING.ACCOUNT}/${index}/security`)
              }
            >
              {t('security:MANAGE_ACCOUNT')}
            </Button>
          </div>

          <div className="mt-8 divide-y divide-gray-100 border-t border-gray-100">
            {shortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.description}
                    </span>
                  </span>
                  <span className="text-sm text-gray-400">›</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
