import type { Configuration } from '#/configuration';
import { Default, TRequest, sendRequest } from '#/helpers/api-caller';
import { APIFinalizeAuthRequest, APILoginExternal } from '#/types/api';

export default (params: Pick<Configuration, 'appUrl'>) => {
  const { appUrl } = params;

  return {
    request: <T extends Default>(params: TRequest<T>) =>
      sendRequest(appUrl, params),
    finalizeAuthRequest: async (data: APIFinalizeAuthRequest['data']) =>
      sendRequest<APIFinalizeAuthRequest>(appUrl, {
        url: '/api/auth_request/finalize',
        method: 'post',
        data,
      }),
    loginExternal: async (data: APILoginExternal['data']) =>
      sendRequest<APILoginExternal>(appUrl, {
        url: '/api/login/external',
        method: 'post',
        data,
      }),
  };
};
