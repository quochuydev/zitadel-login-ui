'use client';
import type { ToastType } from '#/modules/Components/Toast';
import Toast from '#/modules/Components/Toast';
import ApiService from '#/services/frontend/api.service';
import { APIVerifyCode } from '#/types/api';
import type { Application, AuthRequest } from '#/types/zitadel';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const PasswordInitPage = (props: {
  appUrl: string;
  userId: string;
  orgId: string;
  verificationCode: string;
  authRequest?: AuthRequest;
  application?: Application;
}) => {
  const { appUrl, authRequest, application, userId, orgId, verificationCode } =
    props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const [password, setPassword] = useState('');

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center align-middle">
      <div className="mb-[8px] ml-[30px] mr-[30px] flex h-full w-full flex-col justify-center rounded-md border-gray-300 lg:h-[484px] lg:w-[480px] lg:border lg:p-[80px]">
        <div className="m-5 flex max-w-7xl flex-col lg:m-0">
          <div className="my-4 ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="rounded-md shadow-sm space-y-px">
                <div>
                  <input
                    autoFocus
                    name="password"
                    required
                    className="appearance-none rounded-[8px] relative block w-full px-3 py-2 mb-[24px] border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="password"
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                className="disabled:bg-gray-300 group relative w-full flex justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
                onClick={async () => {
                  const result = await apiService.request<APIVerifyCode>({
                    url: '/api/users/verify-code',
                    method: 'post',
                    data: {
                      orgId,
                      password,
                      userId,
                      verificationCode,
                    },
                  });
                }}
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Toast ref={toastRef} />
    </div>
  );
};

export default PasswordInitPage;
