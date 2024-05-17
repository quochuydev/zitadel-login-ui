import configuration from '#/configuration';
import { objectToQueryString } from '#/helpers/api-caller';
import { ROUTING } from '#/helpers/router';
import AuthService from '#/services/backend/auth.service';
import { getCurrentSessions } from '#/services/backend/zitadel.service';
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

  if (!sessions.length) {
    return redirect(
      objectToQueryString(ROUTING.LOGIN, {
        authRequest: authRequestId,
        flow: 'add',
      }),
    );
  }

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
