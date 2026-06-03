import configuration from '#/configuration';
import LoginPasskeys from '#/ui/Passkeys/LoginPasskeys';

export default async () => {
  return <LoginPasskeys appUrl={configuration.appUrl} />;
};
