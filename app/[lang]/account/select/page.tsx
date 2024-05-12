import React from 'react';
import configuration from '#/configuration';
import { getCurrentSessions } from '#/services/backend/zitadel-session';
import AccountSelect from '#/ui/AccountSelect/AccountSelect';
import { ROUTING } from '#/types/router';
import type { AuthRequest } from '#/types/zitadel';
import { redirect } from 'next/navigation';
import AuthService from '#/services/backend/auth.service';

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

  const authRequest = await getAuthRequestInfo(authRequestId);

  return (
    <AccountSelect
      appUrl={configuration.appUrl}
      sessions={sessions}
      authRequest={authRequest}
    />
  );
}

async function getAuthRequestInfo(
  authRequestId?: string,
): Promise<AuthRequest | undefined> {
  if (!authRequestId) return undefined;
  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);

  const authRequest = await oidcService
    .getAuthRequest({ authRequestId })
    .then((e) => e.authRequest)
    .catch(() => undefined);

  return authRequest;
}
