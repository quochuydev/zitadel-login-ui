import LoginPage from '@/components/LoginPage';
import { createSettingClient, serviceAccount, createOIDCClient } from '@/instrumentation-node';
import { getOrgIdFromAuthRequest } from '@/lib/helper';

export default async function Page({ searchParams }: any) {
  const { authRequest: authRequestId } = searchParams;
  console.log({ authRequestId });

  const oidcService = createOIDCClient(serviceAccount);
  const settingService = createSettingClient(serviceAccount);

  const authRequest = authRequestId
    ? await oidcService
        .getAuthRequest({ authRequestId })
        .then((e) => e.authRequest)
        .catch((_) => undefined)
    : undefined;

  const orgId = getOrgIdFromAuthRequest(authRequest) as string;

  const identityProviders = orgId
    ? await settingService
        .getActiveIdentityProviders({ ctx: { orgId } })
        .then((e) => e.identityProviders)
        .catch((_) => [])
    : [];

  return (
    <>
      <LoginPage orgId={orgId} authRequestId={authRequestId} identityProviders={identityProviders} />
    </>
  );
}
