import configuration from '#/configuration';
import AuthService from '#/services/backend/auth.service';
import { getCurrentSessions } from '#/services/backend/zitadel.service';
import AccountSelect from '#/ui/AccountSelect/AccountSelect';

export default async function Page({
  searchParams: { authRequest: authRequestId },
}: {
  searchParams: {
    authRequest?: string;
  };
}) {
  const sessions = await getCurrentSessions();
  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);

  const authRequest = authRequestId
    ? await oidcService
        .getAuthRequest({ authRequestId })
        .then((e) => e.authRequest)
        .catch(() => undefined)
    : undefined;

  return (
    <AccountSelect
      appUrl={configuration.appUrl}
      sessions={sessions}
      authRequest={authRequest}
    />
  );
}
