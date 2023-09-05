import LoginPage from '@/components/LoginPage';
import { createSettingClient, getServiceAccount, createOIDCClient } from '@/instrumentation-node';
import { getOrgIdFromAuthRequest } from '@/lib/helper';

export default async function Page({ searchParams }: any) {
  const { authRequest: authRequestId } = searchParams;
  console.log({ authRequestId });

  const serviceAccount = getServiceAccount();
  const oidcService = createOIDCClient(serviceAccount);
  const settingService = createSettingClient(serviceAccount);

  const authRequest = authRequestId
    ? await oidcService
        .getAuthRequest({ authRequestId })
        .then((e) => e.authRequest)
        .catch((_) => undefined)
    : undefined;

  // console.log('authRequest', authRequest);

  const orgId = getOrgIdFromAuthRequest(authRequest);

  const identityProviders = orgId
    ? await settingService
        .getActiveIdentityProviders({ ctx: { orgId } })
        .then((e) => e.identityProviders)
        .catch((_) => [])
    : [];

  // const brandingSetting = orgId
  //   ? await settingService
  //       .getBrandingSettings({ ctx: { orgId } })
  //       .then((e) => e.settings)
  //       .catch((_) => null)
  //   : null;

  return (
    <>
      {/* {JSON.stringify(brandingSetting)} */}
      <LoginPage orgId={orgId} authRequestId={authRequestId} identityProviders={identityProviders} />
    </>
  );
}
