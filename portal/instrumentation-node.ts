import { ClientMiddleware } from 'nice-grpc';
import type { UserServiceClient } from '@/zitadel-server/proto/zitadel/user/v2beta/user_service';
import { UserServiceDefinition } from '@/zitadel-server/proto/zitadel/user/v2beta/user_service';
import type { SessionServiceClient } from '@/zitadel-server/proto/zitadel/session/v2beta/session_service';
import type { OIDCServiceClient } from '@/zitadel-server/proto/zitadel/oidc/v2beta/oidc_service';
import { SessionServiceDefinition } from '@/zitadel-server/proto/zitadel/session/v2beta/session_service';
import type { GetAuthRequestResponse } from '@/zitadel-server/proto/zitadel/oidc/v2beta/oidc_service';
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
import type { CreateNewSession, FinalizeAuthRequest, GetAuthRequest, GetSession } from './service-portal';

export type { ClientMiddleware };

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

const portalService = PortalService(config.apiEndpoint);

export function createSessionServiceV2(orgId?: string): SessionServiceClient {
  return {
    createSession: async (data) =>
      portalService
        .request<CreateNewSession>({
          url: '/v2beta/sessions',
          method: 'post',
          data: {
            checks: {
              user: {
                loginName: data.checks?.user?.loginName,
              },
              password: {
                password: data.checks?.password?.password,
              },
            },
          },
          credentials: {
            clientId: config.clientId,
            clientSecret: config.clientSecret,
          },
        })
        .then((e) => e),
    getSession: async (data) =>
      portalService
        .request<GetSession>({
          url: '/v2beta/sessions/{sessionId}',
          method: 'get',
          params: {
            sessionId: data.sessionId,
          },
          credentials: {
            clientId: config.clientId,
            clientSecret: config.clientSecret,
          },
        })
        .then((e) => e.session),
  };
}

export function createOIDCServiceV2(orgId?: string): OIDCServiceClient {
  return {
    getAuthRequest: async (data) => {
      const headers: RequestInit['headers'] = {
        'Content-Type': 'application/json',
      };

      if (orgId) {
        headers['x-zitadel-orgid'] = orgId;
      }

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
      portalService.request<FinalizeAuthRequest>({
        url: '/v2beta/oidc/auth_requests/{authRequestId}',
        method: 'post',
        params: {
          authRequestId: data.authRequestId,
        },
        data: {
          session: {
            sessionId: data.session?.sessionId,
            sessionToken: data.session?.sessionToken,
          },
        },
        credentials: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
        },
      }),
  };
}

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
