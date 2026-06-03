import React from 'react';
import configuration from '#/configuration';
import { ROUTING } from '#/lib/router';
import { redirect } from 'next/navigation';
import AuthService from '#/services/auth.service';
import { getCurrentSessions } from '#/services/zitadel.service';
import Security from '#/ui/Security/Security';

export default async function Page({
  params: { index },
}: {
  params: { index: number };
}) {
  const sessions = await getCurrentSessions();
  const session = sessions[index];
  if (!session?.factors?.user) redirect(ROUTING.LOGIN);

  const userId = session.factors.user.id;
  const orgId = session.factors.user.organizationId;

  const accessToken = await AuthService.getAdminAccessToken();
  const userService = AuthService.createUserService(accessToken);
  const { user } = await userService.getUserById(userId);

  const human = user?.human;

  return (
    <Security
      appUrl={configuration.appUrl}
      index={index}
      session={session}
      sessions={sessions}
      profile={{
        userId,
        orgId,
        username: user?.username || user?.preferredLoginName || '',
        firstName: human?.profile?.givenName || '',
        lastName: human?.profile?.familyName || '',
        displayName:
          human?.profile?.displayName || session.factors.user.displayName,
        email: human?.email?.email || '',
        emailVerified: !!human?.email?.isVerified,
        phone: human?.phone?.phone || '',
        phoneVerified: !!human?.phone?.isVerified,
      }}
    />
  );
}
