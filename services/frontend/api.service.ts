import type { Configuration } from '#/configuration';
import type { APILogin, APIFinalizeAuthRequest, APILogout } from '#/types/api';
import { Default, TRequest, sendRequest } from '#/helpers/api-caller';

async function login(appUrl: string, params: APILogin['data']) {
  return sendRequest<APILogin>(appUrl, {
    url: '/api/login',
    method: 'post',
    data: {
      ...params,
    },
  });
}

async function finalizeAuthRequest(
  appUrl: string,
  params: APIFinalizeAuthRequest['data'],
) {
  const { authRequestId, userId } = params;

  return sendRequest<APIFinalizeAuthRequest>(appUrl, {
    url: '/api/auth_request/finalize',
    method: 'post',
    data: {
      authRequestId,
      userId,
    },
  });
}

async function logout(appUrl: string, params: APILogout['data']) {
  return sendRequest<APILogout>(appUrl, {
    url: '/api/logout',
    method: 'post',
    data: {
      sessionId: params.sessionId,
    },
  });
}

export default (params: Pick<Configuration, 'appUrl'>) => {
  const { appUrl } = params;

  return {
    login: (params: APILogin['data']) => login(appUrl, params),
    logout: (params: APILogout['data']) => logout(appUrl, params),
    finalizeAuthRequest: (params: APIFinalizeAuthRequest['data']) =>
      finalizeAuthRequest(appUrl, params),
    request: <T extends Default>(params: TRequest<T>) =>
      sendRequest(appUrl, params),
  };
};
