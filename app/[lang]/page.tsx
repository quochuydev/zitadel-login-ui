import React from 'react';
import configuration from '#/configuration';
import Home from '#/ui/Home/Home';
import { getCurrentSessions } from '#/services/backend/zitadel.service';
import { redirect } from 'next/navigation';
import { ROUTING } from '#/lib/router';

export default async function Page() {
  const index = 0;

  const sessions = await getCurrentSessions();
  if (!sessions[index]) return redirect(ROUTING.LOGIN);

  return (
    <Home
      appUrl={configuration.appUrl}
      activeSession={sessions[index]}
      sessions={sessions}
      index={index}
    />
  );
}
