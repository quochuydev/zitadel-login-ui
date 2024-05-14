export type {
  ListEventsRequest,
  ListEventsResponse,
} from '#/proto/zitadel/admin';
export type { App as Application } from '#/proto/zitadel/app';
export type * from '#/proto/zitadel/idp';
export type {
  ListAppsResponse,
  SetHumanPasswordRequest,
  SetHumanPasswordResponse,
} from '#/proto/zitadel/management';
export type { AuthRequest } from '#/proto/zitadel/oidc/v2beta/authorization';
export type {
  CreateCallbackRequest,
  CreateCallbackResponse,
  GetAuthRequestRequest,
  GetAuthRequestResponse,
  OIDCServiceClient,
} from '#/proto/zitadel/oidc/v2beta/oidc_service';
export type { Challenges } from '#/proto/zitadel/session/v2beta/challenge';
export type { Factors, Session } from '#/proto/zitadel/session/v2beta/session';
export type {
  CreateSessionRequest,
  CreateSessionResponse,
  DeleteSessionRequest,
  DeleteSessionResponse,
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
  SessionServiceClient,
  SetSessionResponse,
} from '#/proto/zitadel/session/v2beta/session_service';
export type {
  BrandingSettings,
  Theme,
} from '#/proto/zitadel/settings/v2beta/branding_settings';
export type { LegalAndSupportSettings } from '#/proto/zitadel/settings/v2beta/legal_settings';
export { IdentityProviderType } from '#/proto/zitadel/settings/v2beta/login_settings';
export type {
  IdentityProvider,
  LoginSettings,
} from '#/proto/zitadel/settings/v2beta/login_settings';
export type { PasswordComplexitySettings } from '#/proto/zitadel/settings/v2beta/password_settings';
export type { ResourceOwnerType } from '#/proto/zitadel/settings/v2beta/settings';
export type {
  GetActiveIdentityProvidersRequest,
  GetActiveIdentityProvidersResponse,
  GetBrandingSettingsResponse,
  GetGeneralSettingsResponse,
  GetLegalAndSupportSettingsResponse,
  GetLoginSettingsRequest,
  GetLoginSettingsResponse,
  GetPasswordComplexitySettingsResponse,
} from '#/proto/zitadel/settings/v2beta/settings_service';
export type { IDPInformation, IDPLink } from '#/proto/zitadel/user/v2beta/idp';
export type {
  AddHumanUserRequest,
  AddHumanUserResponse,
  AuthenticationMethodType,
  CreatePasskeyRegistrationLinkRequest,
  CreatePasskeyRegistrationLinkResponse,
  ListAuthenticationMethodTypesRequest,
  ListAuthenticationMethodTypesResponse,
  RegisterPasskeyRequest,
  RegisterPasskeyResponse,
  RetrieveIdentityProviderIntentRequest,
  RetrieveIdentityProviderIntentResponse,
  StartIdentityProviderIntentRequest,
  StartIdentityProviderIntentResponse,
  VerifyEmailResponse,
  VerifyPasskeyRegistrationRequest,
  VerifyPasskeyRegistrationResponse,
} from '#/proto/zitadel/user/v2beta/user_service';
import { ListEventsRequest, ListEventsResponse } from '#/proto/zitadel/admin';
import { ListAppsResponse } from '#/proto/zitadel/management';
import {
  CreateCallbackRequest,
  CreateCallbackResponse,
  GetAuthRequestRequest,
  GetAuthRequestResponse,
} from '#/proto/zitadel/oidc/v2beta/oidc_service';
import { DeepPartial, PasswordComplexityPolicy } from '#/proto/zitadel/policy';
import {
  CreateSessionRequest,
  CreateSessionResponse,
  DeleteSessionRequest,
  DeleteSessionResponse,
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
  SetSessionRequest,
  SetSessionResponse,
} from '#/proto/zitadel/session/v2beta/session_service';
import { LoginSettings } from '#/proto/zitadel/settings/v2beta/login_settings';

//#region User service
// https://zitadel.com/docs/apis/resources/user_service/user-service-get-user-by-id
export type UserByID = {
  url: 'v2beta/users/{userId}';
  method: 'get';
  params: {
    userId: string;
  };
  result: {
    user: {
      userId: string;
      state: 'USER_STATE_UNSPECIFIED';
      username: string;
      loginNames: string[];
      preferredLoginName: string;
      human: {
        userId: string;
        state: 'USER_STATE_UNSPECIFIED';
        username: string;
        loginNames: string[];
        preferredLoginName: string;
        profile: {
          givenName: string;
          familyName: string;
          nickName: string;
          displayName: string;
          preferredLanguage: 'en';
          gender: 'GENDER_FEMALE';
          avatarUrl: string;
        };
        email: {
          email: string;
          isVerified: boolean;
        };
        phone: {
          phone: string;
          isVerified: boolean;
        };
        passwordChangeRequired: boolean;
      };
      machine: {
        name: string;
        description: string;
        hasSecret: 'true' | 'false';
        accessTokenType: 'ACCESS_TOKEN_TYPE_BEARER';
      };
    };
  };
};

/**
 * https://zitadel.com/docs/apis/resources/user_service/user-service-add-human-user
 */
export type CreateHumanUser = {
  url: '/v2beta/users/human';
  method: 'post';
  data: {
    userId?: string;
    username: string;
    organization: {
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
    details: {
      sequence: string;
      changeDate: string;
      resourceOwner: string;
    };
  };
};

/** https://zitadel.com/docs/apis/resources/user_service/user-service-start-identity-provider-intent
 */
export type StartIdentityProviderIntent = {
  url: '/v2beta/idp_intents';
  method: 'post';
  data: {
    idpId: string;
    urls?: {
      successUrl: string;
      failureUrl: string;
    };
    ldap?: {
      username: string;
      password: string;
    };
  };
  result: {
    details: {
      sequence: string;
      changeDate: string;
      resourceOwner: string;
    };
    authUrl: string;
    idpIntent?: {
      idpIntentId: string;
      idpIntentToken: string;
      userId: string;
    };
    postForm: string;
  };
};

/**
 * https://zitadel.com/docs/apis/resources/user_service/user-service-register-passkey
 */
export type RegisterPasskey = {
  url: '/v2beta/users/{userId}/passkeys';
  method: 'post';
  params: {
    userId: string;
  };
  data: {
    code: {
      id: string;
      code: string;
    };
    authenticator:
      | 'PASSKEY_AUTHENTICATOR_UNSPECIFIED'
      | 'PASSKEY_AUTHENTICATOR_PLATFORM'
      | 'PASSKEY_AUTHENTICATOR_CROSS_PLATFORM';
    domain: string;
  };
  result: {
    passkeyId: string;
    publicKeyCredentialCreationOptions: object;
  };
};

/**
 * https://zitadel.com/docs/apis/resources/user_service/user-service-create-passkey-registration-link
 */
export type CreatePasskeyRegistrationLink = {
  url: '/v2beta/users/{userId}/passkeys/registration_link';
  method: 'post';
  params: {
    userId: string;
  };
  data: {
    returnCode: object;
  };
  result: {
    code: {
      id: string;
      code: string;
    };
  };
};

/**
 * https://zitadel.com/docs/apis/resources/user_service/user-service-verify-passkey-registration
 */
export type VerifyPasskeyRegistration = {
  url: '/v2beta/users/{userId}/passkeys/{passkeyId}';
  method: 'post';
  params: {
    passkeyId: string;
    userId: string;
  };
  data: {
    publicKeyCredential: object;
    passkeyName: string;
  };
  result: void;
};

/** @see https://zitadel.com/docs/apis/resources/user_service/user-service-set-password#change-password
 */
export type ChangePassword = {
  url: '/v2beta/users/{userId}/password';
  method: 'post';
  data: {
    newPassword: {
      password: string;
      changeRequired: boolean;
    };
    currentPassword?: string;
    verificationCode?: string;
  };
  params: {
    userId: string;
  };
  result: void;
};

/**
 * https://zitadel.com/docs/apis/resources/admin/admin-service-get-login-policy
 */
export type GetLoginSettings = {
  url: '/v2beta/settings/login';
  method: 'get';
  query: {
    orgId?: string;
  };
  result: {
    settings: LoginSettings;
  };
};

/** https://zitadel.com/docs/apis/resources/settings_service/settings-service-get-login-settings
 */
export type GetPasswordComplexitySettings = {
  url: '/v2beta/settings/password/complexity';
  method: 'get';
  query: {
    orgId?: string;
    instance?: boolean;
  };
  result: {
    settings: PasswordComplexityPolicy;
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
export type CreateSession = {
  url: '/v2beta/sessions';
  method: 'post';
  data: DeepPartial<CreateSessionRequest>;
  result: CreateSessionResponse;
};

/**
 * https://zitadel.com/docs/apis/resources/session_service/session-service-set-session
 */
export type UpdateSession = {
  url: '/v2beta/sessions/{sessionId}';
  method: 'patch';
  params: {
    sessionId: string;
  };
  data: DeepPartial<Omit<SetSessionRequest, 'sessionId'>>;
  result: SetSessionResponse;
};

export type GetSession = {
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

export type GetAuthRequest = {
  url: '/v2beta/oidc/auth_requests/{authRequestId}';
  method: 'get';
  params: GetAuthRequestRequest;
  result: GetAuthRequestResponse;
};

export type CreateCallback = {
  url: '/v2beta/oidc/auth_requests/{authRequestId}';
  method: 'post';
  params: Pick<CreateCallbackRequest, 'authRequestId'>;
  data: Pick<CreateCallbackRequest, 'session'>;
  result: CreateCallbackResponse;
};
//#endregion

//#region Auth service

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
//#endregion

//#region Admin service
/**
 * https://zitadel.com/docs/apis/resources/admin/admin-service-list-events
 */
export type SearchEvents = {
  url: '/admin/v1/events/_search';
  method: 'post';
  params: DeepPartial<ListEventsRequest>;
  result: ListEventsResponse;
};
//#endregion

//#region Management service

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

/** https://zitadel.com/docs/apis/resources/mgmt/management-service-get-user-by-login-name-global
 */
export type GetUserByLoginName = {
  url: '/management/v1/global/users/_by_login_name';
  method: 'get';
  query: {
    loginName: string;
  };
  result: {
    user: {
      id: string;
      details: {
        sequence: string;
        creationDate: string;
        changeDate: string;
        resourceOwner: string;
      };
      state:
        | 'USER_STATE_UNSPECIFIED'
        | 'USER_STATE_ACTIVE'
        | 'USER_STATE_INACTIVE'
        | 'USER_STATE_DELETED'
        | 'USER_STATE_LOCKED'
        | 'USER_STATE_SUSPEND'
        | 'USER_STATE_INITIAL';
      userName: string;
      loginNames: string[];
      preferredLoginName: string;
      human: {
        profile: {
          firstName: string;
          lastName: string;
          nickName: string;
          displayName: string;
          preferredLanguage: 'en';
          gender:
            | 'GENDER_UNSPECIFIED'
            | 'GENDER_FEMALE'
            | 'GENDER_MALE'
            | 'GENDER_DIVERSE';
          avatarUrl: string;
        };
        email: {
          email: string;
          isEmailVerified: boolean;
        };
        phone: {
          phone: string;
          isPhoneVerified: boolean;
        };
      };
      machine: {
        name: string;
        description: string;
        hasSecret: string;
        accessTokenType: 'ACCESS_TOKEN_TYPE_BEARER' | 'ACCESS_TOKEN_TYPE_JWT';
      };
    };
  };
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
//#endregion

export type GetClientCredentialsToken = {
  url: '/oauth/v2/token';
  method: 'post';
  data: BodyInit;
  result: {
    access_token: string;
    expires_in: number; //seconds
  };
};
