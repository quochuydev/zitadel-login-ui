'use-client';
import React from 'react';
import configuration from '#/configuration';
import LoginExternalSuccess from '#/modules/LoginExternal/LoginExternalSuccess';
import LoginExternalUserNotExisting from '#/modules/LoginExternal/LoginExternalUserNotExisting';

type SearchParams = {
  authRequest: string;
  id: string;
  token: string;
  user?: string;
};

export default async ({ searchParams }: { searchParams: SearchParams }) => {
  const {
    id: idpIntentId,
    token: idpIntentToken,
    authRequest: authRequestId,
    user: userId,
  } = searchParams;

  if (!userId) return <LoginExternalUserNotExisting />;

  return (
    <LoginExternalSuccess
      appUrl={configuration.appUrl}
      idpIntentId={idpIntentId}
      idpIntentToken={idpIntentToken}
      authRequestId={authRequestId}
      userId={userId}
    />
  );
};
