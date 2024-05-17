import configuration from '#/configuration';
import AuthService from '#/services/backend/auth.service';
import PasswordInit from '#/ui/Password/Init';

type Prompt = 'PROMPT_CREATE' | 'PROMPT_UNSPECIFIED';

export default async ({ searchParams }: any) => {
  const {
    authRequest: authRequestId,
    userID: userId,
    code: verificationCode,
    orgID: orgId,
  } = searchParams;

  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);

  const authRequest = authRequestId
    ? await oidcService
        .getAuthRequest({ authRequestId })
        .then((e) => e.authRequest)
        .catch(() => undefined)
    : undefined;

  return (
    <PasswordInit
      appUrl={configuration.appUrl}
      authRequest={authRequest}
      userId={userId}
      orgId={orgId}
      verificationCode={verificationCode}
    />
  );
};
