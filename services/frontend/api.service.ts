import type { Configuration } from '#/configuration';
import { Default, TRequest, sendRequest } from '#/helpers/api-caller';

export default (params: Pick<Configuration, 'appUrl'>) => {
  const { appUrl } = params;

  return {
    request: <T extends Default>(params: TRequest<T>) =>
      sendRequest(appUrl, params),
  };
};
