'use client';

import { Menu, Transition } from '@headlessui/react';
import LogoutIcon from '@heroicons/react/outline/LogoutIcon';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileImage(props: any) {
  const { user, sessions, setSession } = props;
  const router = useRouter();

  const logout = async () => {
    //
  };

  function signInWithHint(session: any): void {
    console.log('session', session);
    setSession(session);
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        {user.loginName}
        <Menu.Button className="items-center  justify-center ml-4 transition-all h-8 w-8 rounded-full shadow-lg ring-2 ring-opacity-50">
          {user && user.image ? (
            <img className="h-8 w-8 rounded-full" src={user.image} alt="user avatar" />
          ) : (
            <span className="text-sm">{user && user.loginName ? user.loginName.substring(0, 1) : 'A'}</span>
          )}
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
        <Menu.Items className="absolute w-80 right-0 mt-5 origin-top-right  divide-y divide-gray-500 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <div className="flex flex-col items-center py-4">
              <p>{user.loginName}</p>
              <p className=" text-sm">{user.displayName}</p>
            </div>
          </div>

          <div className="px-1 py-1 max-h-96 overflow-y-auto">
            {sessions.map((session: any, i: number) => (
              <Menu.Item key={`${session.factors?.user?.loginName}${i}`}>
                {({ active }) => (
                  <button
                    onClick={() => signInWithHint(session)}
                    className={`${
                      active ? 'bg-zitadelblue-300 text-gray-500' : 'bg-zitadelblue-300'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    <div className="w-8 h-8 mr-2 flex items-center justify-center rounded-full bg-black bg-opacity-20">
                      <span className="text-sm">{session ? session.factors?.user?.displayName?.substring(0, 1) : 'A'}</span>
                    </div>
                    <div className="flex flex-col justify-start">
                      <span className="text-left">
                        {session.factors?.user?.displayName} - {session.factors?.user?.organisationId}
                      </span>
                      <span className="text-left text-sm">{session.factors?.user?.loginName}</span>
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
                  } group flex rounded-md justify-center items-center w-full px-2 py-2 text-sm`}
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
                  onClick={() => logout()}
                  className={`${
                    active ? 'bg-zitadelaccent-800 text-gray-500' : ''
                  } group flex rounded-md justify-center items-center w-full px-2 py-2 text-sm`}
                >
                  {active ? (
                    <LogoutIcon className="w-5 h-5 mr-2 text-violet-400" aria-hidden="true" />
                  ) : (
                    <LogoutIcon className="w-5 h-5 mr-2 text-violet-400" aria-hidden="true" />
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
