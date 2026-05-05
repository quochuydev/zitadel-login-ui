import configuration from '#/configuration';
import { ROUTING } from '#/lib/router';
import AuthService, { zitadelService } from '#/services/backend/auth.service';
import { getCurrentSessions } from '#/services/backend/zitadel.service';
import type {
  CreatePasskeyRegistrationLink,
  RegisterPasskey,
} from '#/types/zitadel';
import RegisterPasskeys from '#/ui/Passkeys/RegisterPasskeys';
import { redirect } from 'next/navigation';

export default async ({ params: { index } }: { params: { index: number } }) => {
  const sessions = await getCurrentSessions();
  const session = sessions[index];
  if (!session.factors?.user) redirect(ROUTING.LOGIN);

  const userId = session.factors?.user?.id;
  const orgId = session.factors?.user?.organizationId;
  const loginName = session.factors?.user?.loginName;

  const accessToken = await AuthService.getAdminAccessToken();

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
    <RegisterPasskeys
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
