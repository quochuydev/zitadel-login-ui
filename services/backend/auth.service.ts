import configuration from '#/configuration';
import type {
  CreateCallbackRequest,
  DeleteSessionRequest,
} from '#/types/zitadel';
import type {
  ChangePassword,
  CreateCallback,
  CreateHumanUser,
  CreateSession,
  DeleteSession,
  GetAuthRequest,
  GetMyUserHistory,
  GetSession,
  SearchApplications,
  SearchEvents,
  SearchSessions,
  UpdateSession,
} from './zitadel.service';
import ZitadelService from './zitadel.service';

const zitadelService = ZitadelService({
  host: configuration.zitadel.url,
});

export enum Trigger {
  preCreation = 1,
  postCreation = 2,
  postAuthentication = 3,
}

export enum FlowType {
  internalAuthentication = 1,
  externalAuthentication = 2,
  completeToken = 3,
}

export type Action = (context: {
  user: {
    userId: string;
    orgId: string;
  };
  project: {
    projectId?: string;
  };
  accessToken: string;
}) => Promise<void>;

type Flow = {
  orgId: string;
  flowType: FlowType;
  trigger: Trigger;
  action: Action;
};

export const flows: Flow[] = [];

export const shouldTriggerAction = (params: {
  flow: Flow;
  flowType: FlowType;
  trigger: Trigger;
  orgId: string;
}) => {
  const { flow, flowType, trigger, orgId } = params;

  return (
    !!flow.orgId &&
    flow.orgId === orgId &&
    flow.flowType === flowType &&
    flow.trigger === trigger
  );
};

const createAdminAccessTokenFactory = () => {
  let token;
  let expiryDate = new Date(0);

  const getAdminAccessToken = async () => {
    const { clientId, clientSecret } = configuration.zitadel;

    if (!token || expiryDate < new Date()) {
      const result = await zitadelService.getClientCredentialsToken(
        clientId,
        clientSecret,
      );
      token = result.accessToken;
      expiryDate.setTime(new Date().getTime() + (result.expiresIn - 10) * 1000);
    }

    return token;
  };

  return getAdminAccessToken;
};

async function createAuthService(accessToken: string) {
  return {
    changePassword: async (params: ChangePassword['data']) => {
      const { oldPassword, newPassword } = params;

      return zitadelService.request<ChangePassword>({
        url: '/auth/v1/users/me/password',
        method: 'put',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          oldPassword,
          newPassword,
        },
      });
    },
    getMyUserHistory: async () => {
      return zitadelService.request<GetMyUserHistory>({
        url: '/auth/v1/users/me/changes/_search',
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {},
      });
    },
  };
}

async function createUserService(accessToken: string) {
  const headers: RequestInit['headers'] = {
    Authorization: `Bearer ${accessToken}`,
  };

  return {
    createHumanUser: async (data: CreateHumanUser['data']) => {
      return zitadelService.request<CreateHumanUser>({
        url: '/v2beta/users/human',
        method: 'post',
        headers,
        data,
      });
    },
  };
}

async function createSessionService(accessToken: string) {
  const headers: RequestInit['headers'] = {
    Authorization: `Bearer ${accessToken}`,
  };

  return {
    listSessions: async (data) => {
      return zitadelService.request<SearchSessions>({
        url: '/v2beta/sessions/search',
        method: 'post',
        headers,
        data,
      });
    },
    createSession: async (data: CreateSession['data']) => {
      return zitadelService.request<CreateSession>({
        url: '/v2beta/sessions',
        method: 'post',
        headers,
        data,
      });
    },
    updateSession: async (sessionId:string, data: UpdateSession['data']) => {
      return zitadelService.request<UpdateSession>({
        url: '/v2beta/sessions/{sessionId}',
        method: 'patch',
        params:{
          sessionId
        },
        headers,
        data,
      });
    },
    getSession: async (data: GetSession['params']) => {
      const result = await zitadelService.request<GetSession>({
        url: '/v2beta/sessions/{sessionId}',
        method: 'get',
        headers,
        params: {
          sessionId: data.sessionId,
        },
      });

      return result.session;
    },
    deleteSession: async (data: DeleteSessionRequest) => {
      return zitadelService.request<DeleteSession>({
        url: '/v2beta/sessions/{sessionId}',
        method: 'delete',
        headers,
        params: {
          sessionId: data.sessionId,
        },
        data,
      });
    },
  };
}

async function createOIDCService(accessToken: string) {
  const headers: RequestInit['headers'] = {
    Authorization: `Bearer ${accessToken}`,
  };

  return {
    getAuthRequest: async (data: GetAuthRequest['params']) => {
      return zitadelService.request<GetAuthRequest>({
        url: '/v2beta/oidc/auth_requests/{authRequestId}',
        method: 'get',
        headers,
        params: {
          authRequestId: data.authRequestId,
        },
      });
    },
    createCallback: async (params: CreateCallbackRequest) => {
      const { authRequestId, ...data } = params;

      return zitadelService.request<CreateCallback>({
        url: '/v2beta/oidc/auth_requests/{authRequestId}',
        method: 'post',
        headers,
        params: {
          authRequestId,
        },
        data,
      });
    },
  };
}

async function createAdminService(accessToken: string) {
  const headers: RequestInit['headers'] = {
    Authorization: `Bearer ${accessToken}`,
  };

  return {
    searchEvents: async (data: SearchEvents['params']) => {
      const result = await zitadelService.request<SearchEvents>({
        url: '/admin/v1/events/_search',
        method: 'post',
        headers,
        data,
      });

      return result.events;
    },
  };
}

async function createManagementService(accessToken: string) {
  const headers: RequestInit['headers'] = {
    Authorization: `Bearer ${accessToken}`,
  };

  return {
    searchApplications: async (
      projectId: string,
      data: SearchApplications['data'],
    ) => {
      const result = await zitadelService.request<SearchApplications>({
        url: '/management/v1/projects/{projectId}/apps/_search',
        method: 'post',
        headers,
        params: {
          projectId,
        },
        data,
      });

      return result.result || [];
    },
  };
}

export default {
  createUserService,
  createSessionService,
  createOIDCService,
  createAuthService,
  createAdminService,
  createManagementService,
  getAdminAccessToken: createAdminAccessTokenFactory(),
};
