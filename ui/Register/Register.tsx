'use client';
import { toast } from 'sonner';
import { objectToQueryString } from '#/lib/api-caller';
import { ROUTING } from '#/lib/router';
import { getOrgIdFromAuthRequest } from '#/lib/zitadel';
import ApiService from '#/services/api.service';
import type { APIRegister } from '#/types/api';
import type { AuthRequest } from '#/types/zitadel';
import RegisterForm from '#/ui/Register/components/RegisterForm';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type RegisterParams = {
  username: string;
  email: string;
  familyName: string;
  givenName: string;
  password: string;
};

const RegisterPage = (props: { appUrl: string; authRequest?: AuthRequest }) => {
  const { appUrl, authRequest } = props;
  const [isLoading, setIsLoading] = useState(false);
  const apiService = ApiService({ appUrl });
  const router = useRouter();
  const orgId = getOrgIdFromAuthRequest(authRequest);
  const { t } = useTranslation('common');

  const handleRegisterForm = async (params: RegisterParams) => {
    setIsLoading(true);
    const { username, email, familyName, givenName, password } = params;

    try {
      const result = await apiService.request<APIRegister>({
        url: '/api/register',
        method: 'post',
        data: {
          orgId,
          username,
          email,
          familyName,
          givenName,
          password,
          authRequestId: authRequest?.id,
        },
      });

      if (!result || !result.userId) throw result;

      router.replace(result.callbackUrl || ROUTING.HOME);
    } catch (error) {
      console.error(error);

      toast.error(t('REGISTER_ERROR'));

      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[440px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="relative mb-6 flex items-center justify-center">
          <Link
            href={objectToQueryString(ROUTING.LOGIN, {
              authRequest: authRequest?.id,
            })}
            aria-label={t('BACK')}
            className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            {t('REGISTER_TITLE')}
          </h1>
        </div>

        <RegisterForm
          loading={isLoading}
          handleRegisterForm={handleRegisterForm}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
