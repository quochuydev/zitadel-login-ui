import type { Configuration } from '#/configuration';
import { Default, TRequest, sendRequest } from '#/lib/api-caller';
import {
  APIFinalizeAuthRequest,
  APILoginExternal,
  APIStartExternal,
} from '#/types/api';

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
        url: '/api/external/login',
        method: 'post',
        data,
      }),
    startExternal: (params: APIStartExternal['data']) =>
      sendRequest<APIStartExternal>(appUrl, {
        url: '/api/external/start',
        method: 'post',
        data: params,
      }),
  };
};
