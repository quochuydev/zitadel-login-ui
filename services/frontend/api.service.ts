import type { Configuration } from '#/configuration';
import { Default, TRequest, sendRequest } from '#/lib/api-caller';
import {
  APIFinalizeAuthRequest,
  APILoginExternal,
  APIStartExternal,
} from '#/types/api';

export default (params: Pick<Configuration, 'appUrl'>) => {
  const { appUrl } = params;

  async function startExternal(
    appUrl: string,
    params: APIStartExternal['data'],
  ) {
    return sendRequest<APIStartExternal>(appUrl, {
      url: '/api/external/start',
      method: 'post',
      data: params,
    });
  }

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
    startExternal: (params: APIStartExternal['data']) =>
      startExternal(appUrl, params),
  };
};
