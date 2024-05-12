import configuration from '#/configuration';
import PasswordInit from '#/ui/Password/Init';
import AuthService from '#/services/backend/auth.service';
import { ROUTING } from '#/types/router';
import type { Application, AuthRequest } from '#/types/zitadel';
import { redirect } from 'next/navigation';

type Prompt = 'PROMPT_CREATE' | 'PROMPT_UNSPECIFIED';

export default async ({ searchParams }: any) => {
  const {
    authRequest: authRequestId,
    userID: userId,
    code: verificationCode,
    orgID: orgId,
  } = searchParams;

  const result = await getAuthRequestInfo(authRequestId);

  if (result.redirect === 'registration') {
    return redirect(`${ROUTING.REGISTER}?authRequest=${authRequestId}`);
  }

  return (
    <PasswordInit
      appUrl={configuration.appUrl}
      authRequest={result?.authRequest}
      userId={userId}
      orgId={orgId}
      verificationCode={verificationCode}
    />
  );
};

async function getAuthRequestInfo(authRequestId: string): Promise<{
  authRequest?: AuthRequest;
  application?: Application;
  redirect?: 'registration';
}> {
  if (!authRequestId) {
    return {
      authRequest: undefined,
      application: undefined,
    };
  }

  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);

  const authRequest = await oidcService
    .getAuthRequest({ authRequestId })
    .then((e) => e.authRequest)
    .catch(() => undefined);

  if (authRequest) {
    const prompts = (authRequest.prompt as unknown as Prompt[]) || [];

    if (prompts.includes('PROMPT_CREATE')) {
      return {
        authRequest,
        redirect: 'registration',
      };
    }
  }

  return {
    authRequest,
  };
}
