'use client';

import { Menu, Transition } from '@headlessui/react';
import LogoutIcon from '@heroicons/react/outline/LogoutIcon';
import React, { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import type { Session } from '#/types/zitadel';
import ApiService from '#/services/frontend/api.service';
import { APILogout } from '#/types/api';

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
      <div>
        {user.loginName}
        <Menu.Button className="ml-4 h-8 w-8 rounded-full shadow-lg ring-2 ring-opacity-50 transition-all">
          <span>
            {user && user.loginName ? user.loginName.substring(0, 1) : 'A'}
          </span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-5 w-80 origin-top-right  divide-y divide-gray-500 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-white">
          <div className="px-1 py-1 ">
            <div className="flex flex-col items-center py-4">
              <p>{user.loginName}</p>
              <p className="text-sm">{user.displayName}</p>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto px-1 py-1">
            {sessions?.map((session, i: number) => (
              <Menu.Item key={`${session.factors?.user?.loginName}${i}`}>
                {({ active }) => (
                  <button
                    onClick={() => onSelectAccount(session)}
                    className={`${
                      active
                        ? 'bg-zitadelblue-300 text-gray-500'
                        : 'bg-zitadelblue-300'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-20">
                      <span className="text-sm">
                        {session
                          ? session.factors?.user?.displayName?.substring(0, 1)
                          : 'A'}
                      </span>
                    </div>

                    <div className="flex flex-col justify-start">
                      <span className="text-left">
                        {session.factors?.user?.displayName}
                      </span>

                      <span className="text-left text-sm">
                        {session.factors?.user?.loginName}
                      </span>
                    </div>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>

          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    router.push(`/login`);
                  }}
                  className={`${
                    active ? 'bg-zitadelaccent-800 text-gray-500' : ''
                  } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm`}
                >
                  + Add other account
                </button>
              )}
            </Menu.Item>
          </div>

          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
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
                  className={`${
                    active ? 'bg-zitadelaccent-800 text-gray-500' : ''
                  } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <LogoutIcon
                      className="mr-2 h-5 w-5 text-violet-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <LogoutIcon
                      className="mr-2 h-5 w-5 text-violet-400"
                      aria-hidden="true"
                    />
                  )}
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
