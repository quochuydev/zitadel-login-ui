'use client';

import { ROUTING } from '#/lib/router';
import type { Session } from '#/types/zitadel';
import ShieldCheckIcon from '@heroicons/react/outline/ShieldCheckIcon';
import { useRouter } from 'next/navigation';
import React from 'react';
import ProfileImage from '#/ui/Home/components/ProfileImage';

const navItems = (index: number) => [
  {
    key: 'security',
    label: 'Security',
    icon: ShieldCheckIcon,
    href: `${ROUTING.ACCOUNT}/${index}/security`,
  },
];

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

  const items = navItems(index);

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-50">
      {/* Top bar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-[18px] font-medium text-gray-900">Account</h1>
          <div className="ml-auto flex items-center">
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
        <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white p-4 md:block">
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === active;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-50 font-medium text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}
