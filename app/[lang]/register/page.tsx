import configuration from '#/configuration';
import AuthService from '#/services/backend/auth.service';
import Register from '#/ui/Register/Register';

export default async ({ searchParams }: any) => {
  const { authRequest: authRequestId } = searchParams;

  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);

  const authRequest = await oidcService
    .getAuthRequest({ authRequestId })
    .then((e) => e.authRequest)
    .catch(() => undefined);

  return <Register appUrl={configuration.appUrl} authRequest={authRequest} />;
};
