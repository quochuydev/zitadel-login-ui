import configuration from '#/configuration';
import Passkeys from '#/ui/Passkeys/Passkeys';
import AuthService from '#/services/backend/auth.service';
import ZitadelService, {
  CreatePasskeyRegistrationLink,
  RegisterPasskey,
} from '#/services/backend/zitadel.service';
import { getCurrentSessions } from '#/services/backend/zitadel-session';
import { redirect } from 'next/navigation';
import { ROUTING } from '#/types/router';

export default async ({ params: { index } }: { params: { index: number } }) => {
  const sessions = await getCurrentSessions();
  const session = sessions[index];
  console.log(`debug:session.factors?.user`, session.factors?.user);
  if (!session.factors?.user) redirect(ROUTING.LOGIN);

  const userId = session.factors?.user?.id;
  const orgId = session.factors?.user?.organizationId;
  const loginName = session.factors?.user?.loginName;

  const accessToken = await AuthService.getAdminAccessToken();

  const zitadelService = ZitadelService({
    host: configuration.zitadel.url,
  });

  const passkeyRegistrationLinkResult =
    await zitadelService.request<CreatePasskeyRegistrationLink>({
      url: '/v2beta/users/{userId}/passkeys/registration_link',
      method: 'post',
      params: {
        userId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-zitadel-orgid': orgId,
      },
      data: {
        returnCode: {},
      },
    });

  console.log('configuration', configuration);

  const registerPasskeyResult = await zitadelService.request<RegisterPasskey>({
    url: '/v2beta/users/{userId}/passkeys',
    method: 'post',
    params: {
      userId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-zitadel-orgid': orgId,
    },
    data: {
      code: {
        id: passkeyRegistrationLinkResult.code.id,
        code: passkeyRegistrationLinkResult.code.code,
      },
      authenticator: 'PASSKEY_AUTHENTICATOR_UNSPECIFIED',
      domain: new URL(configuration.appUrl).hostname,
    },
  });

  return (
    <Passkeys
      orgId={orgId}
      userId={userId}
      loginName={loginName}
      passkeyId={registerPasskeyResult.passkeyId}
      publicKeyCredentialCreationOptions={
        registerPasskeyResult.publicKeyCredentialCreationOptions
      }
      appUrl={configuration.appUrl}
    />
  );
};
