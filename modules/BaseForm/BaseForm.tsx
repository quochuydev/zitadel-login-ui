'use client';
import type { ToastType } from '#/modules/Components/Toast';
import Toast from '#/modules/Components/Toast';
import SignInForm from '#/modules/Login/components/SignInForm';
import ApiService from '#/services/frontend/api.service';
import { APILogin } from '#/types/api';
import { ROUTING } from '#/types/router';
import type { Application, AuthRequest } from '#/types/zitadel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const BaseFormPage = (props: {
  appUrl: string;
}) => {
  const { appUrl,  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();

  const handleSignIn = async (params: {
    username: string;
    password: string;
  }) => {
    const { username, password } = params;

    try {
      setIsLoading(true);

      
    } catch (error) {
      console.error(error);

      toastRef.current?.show({
        message: 'Login error',
        intent: 'error',
      });
    }

    setIsLoading(false);

  };

  const [username, setUsername] = useState<string>( '');
  const [password, setPassword] = useState<string>('');
  const [hidePwd, setHidePwd] = useState<boolean>(true);

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center align-middle">
      <div className="mb-[8px] ml-[30px] mr-[30px] flex h-full w-full flex-col justify-center rounded-md border-gray-300 lg:h-[484px] lg:w-[480px] lg:border lg:p-[80px]">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/images/company.png"
            alt="logo"
            width="125"
            height="47"
          />
          <h2 className="mb-[24px] mt-6 text-center text-3xl font-extrabold text-gray-900">
            👋 Welcome!
          </h2>
        </div>

        <div className="m-5 flex max-w-7xl flex-col lg:m-0">
         

        <div className="my-4 ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn({ username, password });
            }}
          >
            <div className="rounded-md shadow-sm space-y-px">
                <div>
                  <input
                    autoFocus
                    name="username"
                    required
                    className="appearance-none rounded-[8px] relative block w-full px-3 py-2 mb-[24px] border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    disabled={isLoading}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={hidePwd ? 'password' : 'text'}
                  required
                  className="appearance-none mb-[24px] rounded-[8px] relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Image
                  src={`/images/${hidePwd ? 'eye' : 'eye-off'}.png`}
                  alt="logo"
                  width={20}
                  height={20}
                  onClick={() => setHidePwd(!hidePwd)}
                  className="absolute right-4 z-10 top-2 hover:cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="disabled:bg-gray-300 group relative w-full flex justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              // disabled={!username.trim() || !password.trim() || isLoading}
            >
              {isLoading ? 'Loading...' : 'Log in'}
            </button>
          </form>
        </div>
        </div>
      </div>

     
      <Toast ref={toastRef} />
    </div>
  );
};

export default BaseFormPage;
