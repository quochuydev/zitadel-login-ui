import configuration from '#/configuration';
import { getProjectIdFromAuthRequest } from '#/helpers/zitadel';
import PasswordReset from '#/modules/Password/Reset';
import AuthService from '#/services/backend/auth.service';
import { ROUTING } from '#/types/router';
import type { Application, AuthRequest } from '#/types/zitadel';
import { redirect } from 'next/navigation';

type Prompt = 'PROMPT_CREATE' | 'PROMPT_UNSPECIFIED';

export default async ({ searchParams }: any) => {
  const { authRequest: authRequestId } = searchParams;

  const result = await getAuthRequestInfo(authRequestId);

  if (result.redirect === 'registration') {
    return redirect(`${ROUTING.REGISTER}?authRequest=${authRequestId}`);
  }

  return (
    <PasswordReset
      appUrl={configuration.appUrl}
      authRequest={result?.authRequest}
      application={result?.application}
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

  const oidcService = await AuthService.createOIDCService(accessToken);

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

    const projectId = getProjectIdFromAuthRequest(authRequest);

    if (projectId) {
      const managementService =
        await AuthService.createManagementService(accessToken);

      const applications = await managementService.searchApplications(
        projectId,
        { queries: [] },
      );

      const application = applications.find(
        (e) => e.oidcConfig?.clientId === authRequest.clientId,
      );

      return {
        authRequest,
        application,
      };
    }
  }

  return {
    authRequest,
  };
}
