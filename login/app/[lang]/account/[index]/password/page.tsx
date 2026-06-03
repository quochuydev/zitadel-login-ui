import React from 'react';
import Password from '#/ui/Password/Password';
import configuration from '#/configuration';
import { redirect } from 'next/navigation';
import { ROUTING } from '#/lib/router';
import { getCurrentSessions } from '#/services/zitadel.service';

export default async (props: {
  searchParams: Promise<{ authRequest: string }>;
  params: Promise<{ index: number }>;
}) => {
  const params = await props.params;

  const { index } = params;

  const searchParams = await props.searchParams;

  const { authRequest: authRequestId } = searchParams;

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
