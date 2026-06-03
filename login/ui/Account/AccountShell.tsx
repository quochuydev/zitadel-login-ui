'use client';

import LanguageSwitcher from '#/components/LanguageSwitcher';
import { ROUTING } from '#/lib/router';
import type { Session } from '#/types/zitadel';
import ShieldCheckIcon from '@heroicons/react/outline/ShieldCheckIcon';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import React from 'react';
import ProfileImage from '#/ui/Home/components/ProfileImage';

export default function AccountShell(props: {
  appUrl: string;
  index: number;
  session: Session;
  sessions: Session[];
  active?: string;
  children: React.ReactNode;
}) {
  const { appUrl, index, session, sessions, active = 'security' } = props;
  const router = useRouter();
  const { t } = useTranslation('common');

  const items = [
    {
      key: 'security',
      label: t('security:SECURITY'),
      icon: ShieldCheckIcon,
      href: `${ROUTING.ACCOUNT}/${index}/security`,
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-50">
      {/* Top bar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-12 items-center px-3 sm:px-4">
          <h1 className="text-[16px] font-medium text-gray-900">
            {t('ACCOUNT')}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher variant="header" />
            <ProfileImage
              appUrl={appUrl}
              session={session}
              sessions={sessions}
              onSelectAccount={(s: Session) => {
                const i = sessions.findIndex((e) => e.id === s.id);
                router.push(`${ROUTING.ACCOUNT}/${i}/security`);
              }}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left navbar */}
        <aside className="hidden w-52 flex-shrink-0 border-r border-gray-200 bg-white p-2 md:block">
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === active;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-50 font-medium text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}
