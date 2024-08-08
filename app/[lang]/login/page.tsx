import configuration from '#/configuration';
import { getAuthRequestInfo } from '#/services/backend/zitadel.service';
import Login from '#/ui/Login/Login';
import { redirect } from 'next/navigation';

type SearchParams = {
  authRequest?: string;
  flow?: 'add';
};

export default async ({ searchParams }: { searchParams: SearchParams }) => {
  const { authRequest, flow } = searchParams;

  const result = await getAuthRequestInfo({ authRequest, flow });
  if (result.redirect) return redirect(result.redirect);

  return (
    <Login
      appUrl={configuration.appUrl}
      authRequest={result.authRequest}
      application={result.application}
      loginSettings={result.loginSettings}
      passwordSettings={result.passwordSettings}
      orgDisplayName={result.orgDisplayName}
      defaultUsername={result.authRequest?.loginHint}
      identityProviders={result.identityProviders}
    />
  );
};
