'use client';
import LoadingState from '#/components/Loading';
import type { ToastType } from '#/components/Toast';
import Toast from '#/components/Toast';
import { objectToQueryString } from '#/lib/api-caller';
import { ROUTING } from '#/lib/router';
import { PasswordComplexityPolicy } from '#/proto/zitadel/policy';
import ApiService from '#/services/frontend/api.service';
import { APILogin } from '#/types/api';
import type {
  Application,
  AuthRequest,
  LoginSettings,
  IdentityProvider,
} from '#/types/zitadel';
import SignInForm from '#/ui/Login/components/SignInForm';
import useTranslations from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getOrgIdFromAuthRequest } from '#/lib/zitadel';

const LoginPage: React.FC<{
  appUrl: string;
  authRequest?: AuthRequest;
  application?: Application;
  loginSettings?: LoginSettings;
  passwordSettings?: PasswordComplexityPolicy;
  orgDisplayName?: string;
  defaultUsername?: string;
  identityProviders?: IdentityProvider[];
}> = (props) => {
  const { appUrl, authRequest, application, loginSettings, identityProviders } =
    props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const apiService = ApiService({ appUrl });
  const toastRef = useRef<ToastType>();
  const { t } = useTranslations('common');
  const orgId = getOrgIdFromAuthRequest(authRequest);

  /**
   * @see
   * https://zitadel.com/docs/apis/openidoauth/endpoints#additional-parameters
   */
  const loginSilently = async (authRequest?: AuthRequest) => {
    try {
      if (!authRequest?.hintUserId) return;

      const result = await apiService.finalizeAuthRequest({
        authRequestId: authRequest.id,
        userId: authRequest.hintUserId,
      });

      if (result.callbackUrl) router.replace(result.callbackUrl);
    } catch (error) {
      setIsLoading(false);
      console.log(JSON.stringify(error));
    }
  };

  useEffect(() => {
    loginSilently(authRequest);
  }, [authRequest?.id]);

  const handleSignIn = async (params: {
    username: string;
    password: string;
  }) => {
    const { username, password } = params;

    try {
      setIsLoading(true);

      const session = await apiService.request<APILogin>({
        url: '/api/login',
        method: 'post',
        data: {
          username,
          password,
          authRequestId: authRequest?.id,
        },
      });

      if (!session || !session.userId) throw session;

      if (session.changeRequired) {
        router.replace(
          objectToQueryString(`${ROUTING.ACCOUNT}/0/password`, {
            authRequest: authRequest?.id,
          }),
        );
        return;
      }

      router.replace(session.callbackUrl || ROUTING.HOME);
    } catch (error) {
      console.error(error);

      toastRef.current?.show({
        message: t('LOGIN_ERROR'),
        intent: 'error',
      });

      setIsLoading(false);
    }
  };

  async function startExternal(idpId: string) {
    setIsLoading(true);

    try {
      const result = await apiService.startExternal({
        orgId,
        idpId,
        authRequestId: authRequest?.id,
      });

      if (!result.authUrl) throw result;

      router.replace(result.authUrl);
    } catch (error) {
      console.error(error);

      toastRef.current?.show({
        message: t('SOMETHING_WENT_WRONG'),
        intent: 'error',
      });

      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-8 sm:py-12">
      <LoadingState loading={isLoading} />

      <div className="w-full max-w-[440px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          {t('WELCOME')}
        </h1>

        <SignInForm
          loading={isLoading}
          defaultUsername={authRequest?.loginHint}
          handleSignIn={handleSignIn}
        />

        {(loginSettings?.passkeysType as unknown as string) ===
          'PASSKEYS_TYPE_ALLOWED' && (
          <button
            type="button"
            className="mt-4 block w-full text-center text-xs font-medium text-info hover:underline focus:outline-none focus:underline"
            onClick={() => {
              setIsLoading(true);

              router.replace(
                objectToQueryString(`/passkeys`, {
                  authRequest: authRequest?.id,
                }),
              );
            }}
          >
            {t('LOGIN_WITH_PASSKEYS')}
          </button>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            {!loginSettings?.hidePasswordReset && (
              <button
                type="button"
                className="text-xs font-medium text-gray700 hover:underline focus:outline-none focus:underline"
                onClick={() => {
                  setIsLoading(true);

                  router.replace(
                    objectToQueryString(`/password/reset`, {
                      authRequest: authRequest?.id,
                    }),
                  );
                }}
              >
                {t('FORGOT_PASSWORD')}
              </button>
            )}
          </div>

          {loginSettings?.allowRegister && (
            <Link
              className="text-sm font-medium text-info hover:underline focus:outline-none focus:underline"
              data-testid={'registerSwitch'}
              onClick={() => setIsLoading(true)}
              href={objectToQueryString(ROUTING.REGISTER, {
                authRequest: authRequest?.id,
              })}
            >
              {t('REGISTER_NOW')}
            </Link>
          )}
        </div>

        {!!identityProviders?.length && (
          <>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs uppercase tracking-wider text-gray-500">
                {t('OR_CONTINUE_WITH')}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="flex flex-col gap-2">
              {identityProviders.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => startExternal(e.id)}
                  disabled={isLoading}
                >
                  {e.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {application?.name && (
        <p className="mt-4 text-xs text-gray-500">
          {t('LOGGING_IN_TO_APP', { appName: application.name })}
        </p>
      )}
      <Toast ref={toastRef} />
    </div>
  );
};

export default LoginPage;
