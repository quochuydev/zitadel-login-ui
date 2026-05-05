import configuration from '#/configuration';
import AuthService from '#/services/backend/auth.service';
import PasswordInit from '#/ui/Password/Init';

export default async ({
  searchParams,
}: {
  searchParams: {
    authRequest?: string;
    userID: string;
    code: string;
    orgID: string;
  };
}) => {
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
