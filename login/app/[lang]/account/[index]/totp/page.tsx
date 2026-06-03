import configuration from '#/configuration';
import { ROUTING } from '#/lib/router';
import AuthService from '#/services/auth.service';
import { getCurrentSessions } from '#/services/zitadel.service';
import RegisterTOTP from '#/ui/TOTP/RegisterTOTP';
import { redirect } from 'next/navigation';

export default async (props: { params: Promise<{ index: number }> }) => {
  const params = await props.params;

  const { index } = params;

  const sessions = await getCurrentSessions();
  const session = sessions[index];
  if (!session.factors?.user) redirect(ROUTING.LOGIN);

  const userId = session.factors?.user?.id;
  const orgId = session.factors?.user?.organizationId;
  const loginName = session.factors?.user?.loginName;

  const accessToken = await AuthService.getAdminAccessToken();

  return (
    <RegisterTOTP
      orgId={orgId}
      userId={userId}
      loginName={loginName}
      appUrl={configuration.appUrl}
    />
  );
};
