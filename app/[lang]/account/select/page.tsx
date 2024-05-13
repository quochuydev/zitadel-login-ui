import configuration from '#/configuration';
import { ROUTING } from '#/helpers/router';
import AuthService from '#/services/backend/auth.service';
import { getCurrentSessions } from '#/services/backend/zitadel-session';
import AccountSelect from '#/ui/AccountSelect/AccountSelect';
import { redirect } from 'next/navigation';

type SearchParams = {
  authRequest: string;
};

export default async function Page({
  searchParams: { authRequest: authRequestId },
}: {
  searchParams: SearchParams;
}) {
  const sessions = await getCurrentSessions();
  if (!sessions.length) return redirect(ROUTING.LOGIN);

  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);

  const authRequest = await oidcService
    .getAuthRequest({ authRequestId })
    .then((e) => e.authRequest)
    .catch(() => undefined);

  return (
    <AccountSelect
      appUrl={configuration.appUrl}
      sessions={sessions}
      authRequest={authRequest}
    />
  );
}
