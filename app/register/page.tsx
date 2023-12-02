import React from 'react';
import Register from '#/modules/Register/Register';
import configuration from '#/configuration';
import AuthService from '#/services/backend/auth.service';
import type { AuthRequest } from '#/types/zitadel';

export default async ({ searchParams }: any) => {
  const { authRequest: authRequestId } = searchParams;

  const result = await getAuthRequestInfo(authRequestId);

  return (
    <Register appUrl={configuration.appUrl} authRequest={result?.authRequest} />
  );
};

async function getAuthRequestInfo(authRequestId: string): Promise<{
  authRequest?: AuthRequest;
}> {
  if (!authRequestId) {
    return {
      authRequest: undefined,
    };
  }

  const accessToken = await AuthService.getAdminAccessToken();

  const oidcService = await AuthService.createOIDCService(accessToken);

  const authRequest = await oidcService
    .getAuthRequest({ authRequestId })
    .then((e) => e.authRequest)
    .catch(() => undefined);

  return {
    authRequest,
  };
}
