import configuration from '#/configuration';
import LoginTOTP from '#/ui/TOTP/LoginTOTP';

export default () => {
  return <LoginTOTP appUrl={configuration.appUrl} />;
};
