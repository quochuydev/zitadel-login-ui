import configuration from '#/configuration';
import AuthService from '#/services/backend/auth.service';
import PasswordReset from '#/ui/Password/Reset';

export default async ({
  searchParams,
}: {
  searchParams: { authRequest?: string };
}) => {
  const { authRequest: authRequestId } = searchParams;

  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);

  const authRequest = authRequestId
    ? await oidcService
        .getAuthRequest({ authRequestId })
        .then((e) => e.authRequest)
        .catch(() => undefined)
    : undefined;

  return (
    <PasswordReset appUrl={configuration.appUrl} authRequest={authRequest} />
  );
};
