'use-client';
import React from 'react';
import configuration from '#/configuration';
import LoginExternalSuccess from '#/ui/LoginExternal/LoginExternalSuccess';
import LoginExternalUserNotExisting from '#/ui/LoginExternal/LoginExternalUserNotExisting';
import AuthService from '#/services/backend/auth.service';
import jwt from 'jsonwebtoken';

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

  if (!userId) {
    const accessToken = await AuthService.getAdminAccessToken();
    const userService = AuthService.createUserService(accessToken);

    const information =
      idpIntentId && idpIntentToken
        ? await userService
            .retrieveIdentityProviderIntent({
              idpIntentId,
              idpIntentToken,
            })
            .catch(() => undefined)
        : undefined;

    const decodedData: any = information?.idpInformation?.oauth?.idToken
      ? jwt.decode(information?.idpInformation?.oauth?.idToken)
      : undefined;

    const name = information?.idpInformation?.rawInformation?.name;
    const givenName = information?.idpInformation?.rawInformation?.given_name;
    const familyName = information?.idpInformation?.rawInformation?.family_name;
    const email = information?.idpInformation?.rawInformation?.email;
    const username = information?.idpInformation?.userName;

    const idpLink = {
      idpId: information?.idpInformation?.idpId,
      userId: information?.idpInformation?.userId || decodedData?.['sub'],
      userName: information?.idpInformation?.userName || decodedData?.['email'],
    };

    return (
      <LoginExternalUserNotExisting
        username={username || idpLink.userName}
        givenName={givenName || name}
        familyName={familyName || name}
        email={email}
        idpLink={idpLink}
        appUrl={configuration.appUrl}
      />
    );
  }

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
