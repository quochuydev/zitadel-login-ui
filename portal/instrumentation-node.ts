import { ClientMiddleware } from 'nice-grpc';
import type { UserServiceClient } from '@/zitadel-server/proto/zitadel/user/v2beta/user_service';
import { UserServiceDefinition } from '@/zitadel-server/proto/zitadel/user/v2beta/user_service';
import type {
  CreateSessionRequest,
  SessionServiceClient,
} from '@/zitadel-server/proto/zitadel/session/v2beta/session_service';
import type { OIDCServiceClient } from '@/zitadel-server/proto/zitadel/oidc/v2beta/oidc_service';
import { SessionServiceDefinition } from '@/zitadel-server/proto/zitadel/session/v2beta/session_service';
import { OIDCServiceDefinition } from '@/zitadel-server/proto/zitadel/oidc/v2beta/oidc_service';
import { AuthServiceDefinition } from '@/zitadel-server/proto/zitadel/auth';
import type { AuthServiceClient } from '@/zitadel-server/proto/zitadel/auth';
import { SettingsServiceDefinition } from '@/zitadel-server/proto/zitadel/settings/v2beta/settings_service';
import type { SettingsServiceClient } from '@/zitadel-server/proto/zitadel/settings/v2beta/settings_service';
import type { ManagementServiceClient } from '@/zitadel-server/proto/zitadel/management';
import { ManagementServiceDefinition } from '@/zitadel-server/proto/zitadel/management';
import { createAuthorizationInterceptor, createClient, createOrgMetadataInterceptor } from './app-service';
import { config } from '@/config';
import { PortalService } from './service-portal';
import type { CreateSession, CreateCallback, GetAuthRequest, GetSession } from './service-portal';

export type { ClientMiddleware };

const portalService = PortalService(config.apiEndpoint);

export function createSessionServiceV2(orgId?: string): Partial<SessionServiceClient> {
  const headers: RequestInit['headers'] = {
    'Content-Type': 'application/json',
  };

  if (orgId) {
    headers['x-zitadel-orgid'] = orgId;
  }

  return {
    createSession: async (data) =>
      portalService.request<CreateSession>({
        url: '/v2beta/sessions',
        method: 'post',
        data: data as CreateSessionRequest,
        credentials: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
        },
      }),
    getSession: async (data) =>
      portalService.request<GetSession>({
        url: '/v2beta/sessions/{sessionId}',
        method: 'get',
        params: {
          sessionId: data.sessionId as string,
        },
        credentials: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
        },
      }),
  };
}

export function createOIDCServiceV2(orgId?: string): OIDCServiceClient {
  const headers: RequestInit['headers'] = {
    'Content-Type': 'application/json',
  };

  if (orgId) {
    headers['x-zitadel-orgid'] = orgId;
  }

  return {
    getAuthRequest: async (data) => {
      return portalService.request<GetAuthRequest>({
        url: '/v2beta/oidc/auth_requests/{authRequestId}',
        method: 'get',
        headers,
        params: {
          authRequestId: data.authRequestId as string,
        },
        credentials: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
        },
      });
    },
    createCallback: async (data) =>
      portalService.request<CreateCallback>({
        url: '/v2beta/oidc/auth_requests/{authRequestId}',
        method: 'post',
        params: {
          authRequestId: data.authRequestId as string,
        },
        data: data as CreateCallback['data'],
        credentials: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
        },
      }),
  };
}

export const authorizationInterceptor = createAuthorizationInterceptor({
  type: 'clientCredentials',
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

export const createUserService = (orgId?: string): UserServiceClient => {
  return createClient<UserServiceClient>({
    definition: UserServiceDefinition,
    interceptors: [authorizationInterceptor, createOrgMetadataInterceptor(orgId)],
  });
};

export function createManagementService(orgId: string): ManagementServiceClient {
  return createClient<ManagementServiceClient>({
    definition: ManagementServiceDefinition,
    interceptors: [authorizationInterceptor, createOrgMetadataInterceptor(orgId)],
  });
}

export function createAuthService(orgId?: string): AuthServiceClient {
  return createClient<AuthServiceClient>({
    definition: AuthServiceDefinition,
    interceptors: [authorizationInterceptor, createOrgMetadataInterceptor(orgId)],
  });
}

export function createSessionService(orgId?: string): SessionServiceClient {
  return createClient<SessionServiceClient>({
    definition: SessionServiceDefinition,
    interceptors: [authorizationInterceptor, createOrgMetadataInterceptor(orgId)],
  });
}

export function createOIDCService(orgId?: string): OIDCServiceClient {
  return createClient<OIDCServiceClient>({
    definition: OIDCServiceDefinition,
    interceptors: [authorizationInterceptor, createOrgMetadataInterceptor(orgId)],
  });
}

export function createSettingService(orgId?: string): SettingsServiceClient {
  return createClient<SettingsServiceClient>({
    definition: SettingsServiceDefinition,
    interceptors: [authorizationInterceptor, createOrgMetadataInterceptor(orgId)],
  });
}
