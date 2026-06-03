import configuration from '#/configuration';
import AuthService from '#/services/auth.service';
import { getCurrentSessions } from '#/services/zitadel.service';
import AccountSelect from '#/ui/AccountSelect/AccountSelect';

export default async function Page(props: {
  searchParams: Promise<{
    authRequest?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const { authRequest: authRequestId } = searchParams;

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
