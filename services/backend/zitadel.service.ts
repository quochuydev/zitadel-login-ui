import type {
  GetSessionResponse,
  CreateCallbackRequest,
  CreateCallbackResponse,
  GetAuthRequestRequest,
  GetAuthRequestResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  DeepPartial,
  DeleteSessionRequest,
  DeleteSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
  ListEventsRequest,
  ListEventsResponse,
  ListAppsResponse,
} from '#/types/zitadel';
import {
  Default,
  TRequest,
  sendRequest,
  getClientCredentialsToken,
} from '#/helpers/api-caller';

//*** User service ***

/**
 * https://zitadel.com/docs/apis/resources/user_service/user-service-add-human-user
 */
export type CreateHumanUser = {
  url: '/v2beta/users/human';
  method: 'post';
  data: {
    userId?: string;
    username: string;
    organisation: {
      orgId: string;
    };
    profile: {
      givenName: string;
      familyName: string;
      nickName?: string;
      displayName: string;
      preferredLanguage?: string;
      gender:
        | 'GENDER_UNSPECIFIED'
        | 'GENDER_FEMALE'
        | 'GENDER_MALE'
        | 'GENDER_DIVERSE';
    };
    email: {
      email: string;
      isVerified: boolean;
    };
    phone?: {
      phone: string;
      isVerified: boolean;
    };
    password: {
      password: string;
      changeRequired: boolean;
    };
  };
  result: {
    userId: string;
  };
};

/**
 * https://zitadel.com/docs/apis/resources/admin/admin-service-get-login-policy
 */
export type GetLoginSettings = {
  url: '/v2beta/settings/login';
  method: 'get';
  query: {
    orgId: string;
  };
  result: {
    settings: {
      allowRegister: boolean;
    };
  };
};

/**
 * https://zitadel.com/docs/apis/resources/session_service/session-service-list-sessions
 */
export type SearchSessions = {
  url: '/v2beta/sessions/search';
  method: 'post';
  data: DeepPartial<ListSessionsRequest>;
  result: ListSessionsResponse;
};

/**
 * https://zitadel.com/docs/apis/resources/session_service/session-service-create-session
 */
type CreateSession = {
  url: '/v2beta/sessions';
  method: 'post';
  data: DeepPartial<CreateSessionRequest>;
  result: CreateSessionResponse;
};

type GetSession = {
  url: '/v2beta/sessions/{sessionId}';
  method: 'get';
  params: {
    sessionId: string;
  };
  result: GetSessionResponse;
};

/**
 * https://zitadel.com/docs/apis/resources/session_service/session-service-delete-session
 */
export type DeleteSession = {
  url: '/v2beta/sessions/{sessionId}';
  method: 'delete';
  params: {
    sessionId: string;
  };
  data: Pick<DeleteSessionRequest, 'sessionToken'>;
  result: DeleteSessionResponse;
};

type GetAuthRequest = {
  url: '/v2beta/oidc/auth_requests/{authRequestId}';
  method: 'get';
  params: GetAuthRequestRequest;
  result: GetAuthRequestResponse;
};

type CreateCallback = {
  url: '/v2beta/oidc/auth_requests/{authRequestId}';
  method: 'post';
  params: Pick<CreateCallbackRequest, 'authRequestId'>;
  data: Pick<CreateCallbackRequest, 'session'>;
  result: CreateCallbackResponse;
};

export type ChangePassword = {
  url: '/auth/v1/users/me/password';
  method: 'put';
  data: {
    oldPassword: string;
    newPassword: string;
  };
  result: void;
};

export type GetMyUserHistory = {
  url: '/auth/v1/users/me/changes/_search';
  method: 'post';
  data: {};
  result: {
    result: Array<{
      eventType: {
        key: 'EventTypes.user.human.password.changed';
      };
    }>;
  };
};

// Admin APIs

/**
 * https://zitadel.com/docs/apis/resources/admin/admin-service-list-events
 */
export type SearchEvents = {
  url: '/admin/v1/events/_search';
  method: 'post';
  params: DeepPartial<ListEventsRequest>;
  result: ListEventsResponse;
};

// Management APIs

/**
 * https://zitadel.com/docs/apis/resources/mgmt/management-service-list-apps
 */
export type SearchApplications = {
  url: '/management/v1/projects/{projectId}/apps/_search';
  method: 'post';
  params: {
    projectId: string;
  };
  data: {
    queries: Array<{
      nameQuery?: {
        name: string;
        method: 'TEXT_QUERY_METHOD_EQUALS';
      };
    }>;
  };
  result: ListAppsResponse;
};

/**
 * https://zitadel.com/docs/apis/resources/mgmt/management-service-list-granted-projects
 */
export type SearchGrantedProject = {
  url: '/management/v1/granted_projects/_search';
  method: 'post';
  data: {
    queries?: Array<{
      projectIdQuery?: {
        projectId: string;
      };
      grantedOrgIdQuery?: {
        grantedOrgId: string;
      };
    }>;
  };
  result: {
    result: Array<{
      grantId: string;
      projectId: string;
    }>;
  };
};

/**
 * https://zitadel.com/docs/apis/resources/mgmt/management-service-add-user-grant
 */
export type AddUserGrant = {
  url: '/management/v1/users/{userId}/grants';
  method: 'post';
  params: {
    userId: string;
  };
  data: {
    projectId: string;
    projectGrantId?: string;
    roleKeys: string[];
  };
  result: {
    userGrantId: string;
  };
};

export type { CreateSession, GetSession, GetAuthRequest, CreateCallback };

export default (params: { host: string }) => {
  const { host } = params;

  return {
    request: <T extends Default>(request: TRequest<T>) =>
      sendRequest(host, request),
    getClientCredentialsToken: (clientId: string, clientSecret: string) =>
      getClientCredentialsToken({ host, clientId, clientSecret }),
  };
};
