import configuration from '#/configuration';
import AuthService from '#/services/backend/auth.service';
import PasswordReset from '#/ui/Password/Reset';

export default async ({ searchParams }: any) => {
  const { authRequest: authRequestId } = searchParams;

  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);

  const authRequest = await oidcService
    .getAuthRequest({ authRequestId })
    .then((e) => e.authRequest)
    .catch(() => undefined);

  return (
    <PasswordReset appUrl={configuration.appUrl} authRequest={authRequest} />
  );
};
