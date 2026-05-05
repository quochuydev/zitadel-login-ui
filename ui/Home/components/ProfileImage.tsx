'use client';

import ApiService from '#/services/frontend/api.service';
import { APILogout } from '#/types/api';
import type { Session } from '#/types/zitadel';
import { Menu, Transition } from '@headlessui/react';
import LogoutIcon from '@heroicons/react/outline/LogoutIcon';
import PlusIcon from '@heroicons/react/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import React, { Fragment } from 'react';

const initialOf = (name?: string) =>
  name && name.length ? name.substring(0, 1).toUpperCase() : 'A';

export default function ProfileImage(props: {
  appUrl: string;
  session: Session;
  sessions: Session[];
  onSelectAccount: (session: Session) => void;
}) {
  const { appUrl, session, sessions, onSelectAccount } = props;
  const router = useRouter();
  const apiService = ApiService({ appUrl });

  const user = {
    loginName: session?.factors?.user?.loginName,
    displayName: session?.factors?.user?.displayName,
    orgId: session?.factors?.user?.organizationId,
    userId: session?.factors?.user?.id,
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 rounded-full p-1 pr-3 text-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
        >
          {initialOf(user.displayName || user.loginName)}
        </span>
        <span className="hidden max-w-[160px] truncate text-sm font-medium text-gray-700 sm:inline">
          {user.loginName}
        </span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="flex flex-col items-center gap-2 px-4 py-4 text-center">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-base font-semibold text-indigo-700"
            >
              {initialOf(user.displayName || user.loginName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {user.displayName || user.loginName}
              </p>
              {user.displayName && user.loginName && (
                <p className="truncate text-xs text-gray-500">
                  {user.loginName}
                </p>
              )}
            </div>
          </div>

          {sessions?.length > 1 && (
            <div className="max-h-72 overflow-y-auto py-1">
              {sessions.map((s, i) => {
                const sLogin = s.factors?.user?.loginName;
                const sDisplay = s.factors?.user?.displayName;
                const isCurrent = s.id === session.id;
                return (
                  <Menu.Item key={`${sLogin}${i}`} disabled={isCurrent}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => onSelectAccount(s)}
                        disabled={isCurrent}
                        className={`group flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                          active ? 'bg-gray-50' : ''
                        } ${isCurrent ? 'cursor-default opacity-60' : ''}`}
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700"
                        >
                          {initialOf(sDisplay || sLogin)}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-gray-900">
                            {sDisplay || sLogin}
                          </span>
                          {sDisplay && sLogin && (
                            <span className="truncate text-xs text-gray-500">
                              {sLogin}
                            </span>
                          )}
                        </span>
                      </button>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          )}

          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => router.push(`/login`)}
                  className={`group flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition-colors ${
                    active ? 'bg-gray-50' : ''
                  }`}
                >
                  <PlusIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  Add another account
                </button>
              )}
            </Menu.Item>
          </div>

          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await apiService.request<APILogout>({
                        url: '/api/logout',
                        method: 'post',
                        data: {
                          sessionId: session.id,
                        },
                      });
                    } catch (error) {
                      console.log('error', error);
                    }

                    router.push(`/login`);
                  }}
                  className={`group flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition-colors ${
                    active ? 'bg-gray-50' : ''
                  }`}
                >
                  <LogoutIcon
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
