import configuration from '#/configuration';
import AuthService from '#/services/auth.service';
import Register from '#/ui/Register/Register';

export default async (props: {
  searchParams: Promise<{ authRequest?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const { authRequest: authRequestId } = searchParams;

  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);

  const authRequest = authRequestId
    ? await oidcService
        .getAuthRequest({ authRequestId })
        .then((e) => e.authRequest)
        .catch(() => undefined)
    : undefined;

  return <Register appUrl={configuration.appUrl} authRequest={authRequest} />;
};
