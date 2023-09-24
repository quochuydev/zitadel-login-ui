//*** Management ***

import type { GetAuthRequestRequest, GetAuthRequestResponse } from '@/zitadel-server/proto/zitadel/oidc/v2beta/oidc_service';

/**
 * @see https://zitadel.com/docs/apis/resources/mgmt/management-service-add-org#create-organization
 */
export type CreateOrganization = {
  url: '/management/v1/orgs';
  method: 'post';
  data: {
    name: string;
  };
  result: {
    id: string;
  };
};

/**
 * https://zitadel.com/docs/apis/resources/mgmt/management-service-add-machine-user
 */
export type CreateMachineUser = {
  url: '/management/v1/users/machine';
  method: 'post';
  data: {
    userName: string;
    name: string;
    accessTokenType: 'ACCESS_TOKEN_TYPE_BEARER';
  };
  result: {
    userId: string;
  };
};

/**
 * https://zitadel.com/docs/apis/resources/mgmt/management-service-add-project
 */
export type CreateProject = {
  url: '/management/v1/users/machine';
  method: 'post';
  data: {
    name: string;
    projectRoleAssertion: boolean;
    projectRoleCheck: boolean;
    hasProjectCheck: boolean;
    privateLabelingSetting: 'PRIVATE_LABELING_SETTING_UNSPECIFIED';
  };
  result: {
    id: string;
  };
};

export type BulkAddProjectRole = {
  url: '/management/v1/projects/{projectId}/roles/_bulk';
  method: 'post';
  params: {
    projectId: string;
  };
  data: {
    roles: Array<{
      key: string;
      display_name: string;
    }>;
  };
  result: void;
};

/**
 * https://zitadel.com/docs/apis/resources/mgmt/management-service-add-project-grant
 */
export type AddProjectGrant = {
  url: '/management/v1/projects/{projectId}/grants';
  method: 'post';
  params: {
    projectId: string;
  };
  data: {
    grantedOrgId: string;
    roleKeys: string[];
  };
  result: {
    grantId: string;
  };
};

/**
 * @see https://zitadel.com/docs/apis/resources/mgmt/management-service-is-user-unique
 */
export type CheckExistingUser = {
  url: '/management/v1/users/_is_unique';
  method: 'get';
  query: {
    userName: string;
  };
  result: {
    isUnique: boolean;
  };
};

/**
 * https://zitadel.com/docs/apis/resources/mgmt/management-service-list-granted-projects
 */
export type SearchGrantedProject = {
  url: '/management/v1/granted_projects/_search';
  method: 'post';
  data: {};
  result: {
    result: Array<{
      grantId: string;
      projectId: string;
    }>;
  };
};

/**
 * @see https://zitadel.com/docs/apis/resources/mgmt/management-service-add-user-grant
 */
export type AddUserGrant = {
  url: '/management/v1/users/{userId}/grants';
  method: 'post';
  params: {
    userId: string;
  };
  data: {
    projectId: string;
    projectGrantId: string;
    roleKeys: string[];
  };
  result: {
    userGrantId: string;
  };
};

/**
 * @see https://zitadel.com/docs/apis/resources/mgmt/management-service-get-user-by-id
 */
export type GetUserByID = {
  url: '/management/v1/users/{userId}';
  method: 'get';
  params: {
    userId: string;
  };
  result: {
    user: {
      id: string;
      userName: string;
      preferredLoginName: string;
    };
  };
};

export type CreateSecretForMachineUser = {
  url: '/management/v1/users/{userId}/secret';
  method: 'put';
  params: {
    userId: string;
  };
  data: {};
  result: {
    clientId: string;
    clientSecret: string;
  };
};

export type AddOrganizationMember = {
  url: '/management/v1/orgs/me/members';
  method: 'post';
  data: {
    userId: string;
    roles: Array<'ORG_OWNER' | 'ORG_OWNER_VIEWER'>;
  };
  result: void;
};

//*** Admin ***

export type AddIAMMember = {
  url: '/admin/v1/members';
  method: 'post';
  data: {
    userId: string;
    roles: Array<'IAM_ORG_MANAGER' | 'IAM_USER_MANAGER'>;
  };
  result: void;
};

//*** User service ***

/**
 * @see https://zitadel.com/docs/apis/resources/user_service/user-service-add-human-user
 */
export type CreateHumanUser = {
  url: '/v2beta/users/human';
  method: 'post';
  data: {
    userId?: string;
    username: string;
    organisation?: {
      orgId: string;
    };
    profile: {
      givenName: string;
      familyName: string;
      nickName?: string;
      displayName: string;
      preferredLanguage?: string;
      gender: 'GENDER_UNSPECIFIED' | 'GENDER_FEMALE' | 'GENDER_MALE' | 'GENDER_DIVERSE';
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
  params: {
    userId: string;
  };
  result: {
    userId: string;
  };
};

/**
 * @see https://zitadel.com/docs/apis/resources/user_service/user-service-set-password#change-password
 */
export type ChangePassword = {
  url: '/v2beta/users/{userId}/password';
  method: 'post';
  data: {
    newPassword: {
      password: string;
      changeRequired: boolean;
    };
    currentPassword: string;
  };
  params: {
    userId: string;
  };
  result: void;
};

/**
 * https://zitadel.com/docs/apis/resources/session_service/session-service-create-session
 */
export type CreateNewSession = {
  url: '/v2beta/sessions';
  method: 'post';
  data: {
    checks: {
      user: {
        userId: string;
        loginName: string;
      };
      password: {
        password: string;
      };
    };
  };
  result: {
    sessionId: string;
    sessionToken: string;
  };
};

export type GetSession = {
  url: '/v2beta/sessions/{sessionId}';
  method: 'get';
  params: {
    sessionId: string;
  };
  result: {
    session: {
      id: string;
      factors: {
        user: {
          id: string;
        };
      };
    };
  };
};

export type GetAuthRequest = {
  url: '/v2beta/oidc/auth_requests/{authRequestId}';
  method: 'get';
  params: GetAuthRequestRequest;
  result: GetAuthRequestResponse;
};

export type FinalizeAuthRequest = {
  url: '/v2beta/oidc/auth_requests/{authRequestId}';
  method: 'post';
  params: {
    authRequestId: string;
  };
  data: {
    session: {
      sessionId: string;
      sessionToken: string;
    };
  };
  result: {
    callbackUrl: string;
  };
};
