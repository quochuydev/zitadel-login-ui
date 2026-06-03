import configuration from '#/configuration';
import { ROUTING } from '#/lib/router';
import AuthService, { zitadelService } from '#/services/auth.service';
import { getCurrentSessions } from '#/services/zitadel.service';
import type {
  CreatePasskeyRegistrationLink,
  RegisterPasskey,
} from '#/types/zitadel';
import PasskeysManager from '#/ui/Passkeys/PasskeysManager';
import { redirect } from 'next/navigation';

export default async (props: { params: Promise<{ index: number }> }) => {
  const params = await props.params;

  const { index } = params;

  const sessions = await getCurrentSessions();
  const session = sessions[index];
  if (!session?.factors?.user) redirect(ROUTING.LOGIN);

  const userId = session.factors.user.id;
  const orgId = session.factors.user.organizationId;

  const accessToken = await AuthService.getAdminAccessToken();
  const userService = AuthService.createUserService(accessToken);

  // Existing passkeys for the list.
  const passkeys = await userService
    .listPasskeys({ userId, orgId })
    .catch(() => []);

  // Pre-generate registration options so the "Add passkey" dialog can run the
  // WebAuthN flow without an extra round-trip. Tolerate failures so the list
  // still renders.
  let passkeyId: string | undefined;
  let publicKeyCredentialCreationOptions: unknown;

  try {
    const registrationLink =
      await zitadelService.request<CreatePasskeyRegistrationLink>({
        url: '/v2beta/users/{userId}/passkeys/registration_link',
        method: 'post',
        params: { userId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-zitadel-orgid': orgId,
        },
        data: {
          returnCode: {},
        },
      });

    const registerPasskey = await zitadelService.request<RegisterPasskey>({
      url: '/v2beta/users/{userId}/passkeys',
      method: 'post',
      params: { userId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-zitadel-orgid': orgId,
      },
      data: {
        code: {
          id: registrationLink.code.id,
          code: registrationLink.code.code,
        },
        authenticator: 'PASSKEY_AUTHENTICATOR_UNSPECIFIED',
        domain: new URL(configuration.appUrl).hostname,
      },
    });

    passkeyId = registerPasskey.passkeyId;
    publicKeyCredentialCreationOptions =
      registerPasskey.publicKeyCredentialCreationOptions;
  } catch (error) {
    console.log('debug:passkey registration options', error);
  }

  return (
    <PasskeysManager
      appUrl={configuration.appUrl}
      index={index}
      session={session}
      sessions={sessions}
      orgId={orgId}
      userId={userId}
      passkeyId={passkeyId}
      publicKeyCredentialCreationOptions={publicKeyCredentialCreationOptions}
      passkeys={passkeys}
    />
  );
};
