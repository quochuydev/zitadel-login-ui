import React from 'react';
import Password from '#/modules/Password/Password';
import configuration from '#/configuration';
import { redirect } from 'next/navigation';
import { ROUTING } from '#/types/router';
import { getCurrentSessions } from '#/helpers/session';

export default async ({ searchParams, params: { index } }) => {
  const { authRequest: authRequestId } = searchParams;
  const sessions = await getCurrentSessions();

  if (!sessions[index]) {
    redirect(ROUTING.LOGIN);
  }

  return (
    <Password
      appUrl={configuration.appUrl}
      activeSession={sessions[index]}
      authRequestId={authRequestId}
    />
  );
};
