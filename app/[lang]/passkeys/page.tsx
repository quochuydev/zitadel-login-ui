import configuration from '#/configuration';
import LoginPasskeys from '#/ui/Passkeys/LoginPasskeys';

export default () => {
  return <LoginPasskeys appUrl={configuration.appUrl} />;
};
