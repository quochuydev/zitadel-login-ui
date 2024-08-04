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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getOrgIdFromAuthRequest } from '#/lib/zitadel';

const LoginPage = (props: {
  appUrl: string;
  authRequest?: AuthRequest;
  application?: Application;
  loginSettings?: LoginSettings;
  passwordSettings?: PasswordComplexityPolicy;
  orgDisplayName?: string;
  defaultUsername?: string;
  identityProviders?: IdentityProvider[];
}) => {
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
        message: 'Login error',
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
    <div className="flex h-full w-full flex-col items-center justify-center">
      <LoadingState loading={isLoading} />

      <div className="flex w-full flex-col justify-center rounded-md border-gray-300 lg:w-[480px] lg:border p-5">
        <Image
          src="/images/company.png"
          alt="logo"
          width="125"
          height="47"
          className="self-center"
        />

        <h2 className="my-6 text-center text-3xl font-extrabold text-gray-900">
          👋 Welcome!
        </h2>

        <SignInForm
          loading={isLoading}
          defaultUsername={authRequest?.loginHint}
          handleSignIn={handleSignIn}
        />

        {(loginSettings?.passkeysType as unknown as string) ===
          'PASSKEYS_TYPE_ALLOWED' && (
          <a
            className="flex self-center cursor-pointer text-[12px] font-normal text-info mb-2 mt-6"
            onClick={() => {
              setIsLoading(true);

              router.replace(
                objectToQueryString(`/passkeys`, {
                  authRequest: authRequest?.id,
                }),
              );
            }}
          >
            Login with passkeys
          </a>
        )}

        <div className="flex justify-between items-center">
          <div>
            {!loginSettings?.hidePasswordReset && (
              <a
                className="text-[12px] font-normal text-[#4F6679] cursor-pointer"
                onClick={() => {
                  setIsLoading(true);

                  router.replace(
                    objectToQueryString(`/password/reset`, {
                      authRequest: authRequest?.id,
                    }),
                  );
                }}
              >
                Forgot password?
              </a>
            )}
          </div>

          {loginSettings?.allowRegister && (
            <p className="text-center text-black font-normal">
              <Link
                className="text-info text-[15px] font-normal"
                data-testid={'registerSwitch'}
                onClick={() => setIsLoading(true)}
                href={objectToQueryString(ROUTING.REGISTER, {
                  authRequest: authRequest?.id,
                })}
              >
                {t('REGISTER_NOW')}
              </Link>
            </p>
          )}
        </div>

        {!!identityProviders?.length && (
          <div className="w-full">
            {identityProviders.map((e) => (
              <button
                type="submit"
                className="disabled:bg-gray-300 group w-full flex justify-center py-2 border text-sm font-medium rounded-md border-black my-5"
                onClick={() => startExternal(e.id)}
                disabled={isLoading}
              >
                {e.name}
              </button>
            ))}
          </div>
        )}

        <pre className="hidden">{JSON.stringify(loginSettings, null, 2)}</pre>
      </div>

      {application?.name && (
        <p className="mb-[18px] text-[12px] font-normal text-[#4F6679]">
          You are logging in to {application?.name}
        </p>
      )}
      <Toast ref={toastRef} />
    </div>
  );
};

export default LoginPage;
