import React from 'react';
import Password from '#/ui/Password/Password';
import configuration from '#/configuration';
import { redirect } from 'next/navigation';
import { ROUTING } from '#/helpers/router';
import { getCurrentSessions } from '#/services/backend/zitadel.service';

export default async ({
  searchParams: { authRequest: authRequestId },
  params: { index },
}: {
  searchParams: { authRequest: string };
  params: { index: number };
}) => {
  const sessions = await getCurrentSessions();
  if (!sessions[index]) redirect(ROUTING.LOGIN);

  return (
    <Password
      appUrl={configuration.appUrl}
      activeSession={sessions[index]}
      authRequestId={authRequestId}
    />
  );
};
