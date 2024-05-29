import configuration from '#/configuration';
import { Default, TRequest, sendRequest } from '#/lib/api-caller';
import type {
  ChangePassword,
  CreateCallback,
  CreateCallbackRequest,
  CreateHumanUser,
  CreateSession,
  DeleteSession,
  DeleteSessionRequest,
  GetAuthRequest,
  GetLoginSettings,
  GetMyUserHistory,
  GetPasswordComplexitySettings,
  GetActiveIdentityProviders,
  GetSession,
  GetUserByLoginName,
  SearchApplications,
  SearchEvents,
  SearchSessions,
  StartIdentityProviderIntent,
  UpdateSession,
  UserByID,
} from '#/types/zitadel';

const ZitadelService = (params: { host: string }) => {
  const { host } = params;

  return {
    request: <T extends Default>(request: TRequest<T>) =>
      sendRequest(host, request),
  };
};

export const zitadelService = ZitadelService({
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

function createAuthService(accessToken: string) {
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

function createUserService(accessToken: string) {
  const headers: RequestInit['headers'] = {
    Authorization: `Bearer ${accessToken}`,
  };

  return {
    createHumanUser: async (params: {
      orgId?: string;
      data: CreateHumanUser['data'];
    }) => {
      const { data, orgId } = params;

      if (orgId) {
        headers['x-zitadel-orgid'] = orgId;
      }

      return zitadelService.request<CreateHumanUser>({
        url: '/v2beta/users/human',
        method: 'post',
        headers,
        data,
      });
    },
    getUserById: async (userId: string) => {
      return zitadelService.request<UserByID>({
        url: 'v2beta/users/{userId}',
        method: 'get',
        headers,
        params: {
          userId,
        },
      });
    },
    startIdentityProviderIntent: (params: {
      orgId?: string;
      data: StartIdentityProviderIntent['data'];
    }) => {
      const { orgId, data } = params;

      if (orgId) {
        headers['x-zitadel-orgid'] = orgId;
      }

      return zitadelService.request<StartIdentityProviderIntent>({
        url: '/v2beta/idp_intents',
        method: 'post',
        headers,
        data,
      });
    },
    changePassword: (params: {
      userId: string;
      orgId: string;
      currentPassword?: string;
      verificationCode?: string;
      newPassword: string;
    }) => {
      const { userId, orgId, currentPassword, verificationCode, newPassword } =
        params;

      return zitadelService.request<ChangePassword>({
        url: '/v2beta/users/{userId}/password',
        params: {
          userId,
        },
        method: 'post',
        headers: {
          ...headers,
          'x-zitadel-orgid': orgId,
        },
        data: {
          currentPassword,
          verificationCode,
          newPassword: {
            changeRequired: false,
            password: newPassword,
          },
        },
      });
    },
  };
}

function createSessionService(accessToken: string) {
  const headers: RequestInit['headers'] = {
    Authorization: `Bearer ${accessToken}`,
  };

  return {
    listSessions: async (data: SearchSessions['data']) => {
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
    updateSession: async (sessionId: string, data: UpdateSession['data']) => {
      return zitadelService.request<UpdateSession>({
        url: '/v2beta/sessions/{sessionId}',
        method: 'patch',
        params: {
          sessionId,
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

function createOIDCService(accessToken: string) {
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

function createSettingService(accessToken: string) {
  const headers: RequestInit['headers'] = {
    Authorization: `Bearer ${accessToken}`,
  };

  return {
    getLoginSettings: async (orgId?: string) => {
      const query: { orgId?: string } = {};

      if (orgId) {
        headers['x-zitadel-orgid'] = orgId;
        query.orgId = orgId;
      }

      return zitadelService
        .request<GetLoginSettings>({
          url: '/v2beta/settings/login',
          query,
          method: 'get',
          headers,
        })
        .then((res) => res.settings);
    },
    getPasswordComplexitySettings: async (orgId?: string) => {
      if (orgId) {
        headers['x-zitadel-orgid'] = orgId;
      }

      const query = orgId ? { orgId } : undefined;

      return zitadelService
        .request<GetPasswordComplexitySettings>({
          url: '/v2beta/settings/password/complexity',
          query,
          method: 'get',
          headers,
        })
        .then((res) => res.settings);
    },
    getActiveIdentityProviders: async (orgId?: string) => {
      const result = await zitadelService.request<GetActiveIdentityProviders>({
        url: '/v2beta/settings/login/idps',
        method: 'get',
        query: {
          orgId,
        },
        headers,
      });

      return result.identityProviders || [];
    },
  };
}

function createAdminService(accessToken: string) {
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

function createManagementService(accessToken: string) {
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
    getUserByLoginName: async (loginName: string) => {
      const result = await zitadelService.request<GetUserByLoginName>({
        url: '/management/v1/global/users/_by_login_name',
        method: 'get',
        headers,
        query: {
          loginName,
        },
      });

      return result.user;
    },
  };
}

export default {
  createUserService,
  createSessionService,
  createOIDCService,
  createSettingService,
  createAuthService,
  createAdminService,
  createManagementService,
  getAdminAccessToken: async () => configuration.zitadel.userToken,
};
