import { ClientMiddleware } from 'nice-grpc';
import type { UserServiceClient } from '@/zitadel-server/proto/zitadel/user/v2beta/user_service';
import { UserServiceDefinition } from '@/zitadel-server/proto/zitadel/user/v2beta/user_service';
import type { SessionServiceClient } from '@/zitadel-server/proto/zitadel/session/v2beta/session_service';
import { SessionServiceDefinition } from '@/zitadel-server/proto/zitadel/session/v2beta/session_service';
import type { OIDCServiceClient } from '@/zitadel-server/proto/zitadel/oidc/v2beta/oidc_service';
import { OIDCServiceDefinition } from '@/zitadel-server/proto/zitadel/oidc/v2beta/oidc_service';
import { AuthServiceDefinition } from '@/zitadel-server/proto/zitadel/auth';
import type { AuthServiceClient } from '@/zitadel-server/proto/zitadel/auth';
import { SettingsServiceDefinition } from '@/zitadel-server/proto/zitadel/settings/v2beta/settings_service';
import type { SettingsServiceClient } from '@/zitadel-server/proto/zitadel/settings/v2beta/settings_service';
import type { ManagementServiceClient } from '@/zitadel-server/proto/zitadel/management';
import { ManagementServiceDefinition } from '@/zitadel-server/proto/zitadel/management';
import { createAuthorizationInterceptor, createClient, createOrgMetadataInterceptor } from './app-service';

export type { ClientMiddleware };

if (!process.env.ZITADEL_API_URL) {
  throw new Error('Invalid ZITADEL_API_URL');
}

export const authorizationInterceptor = createAuthorizationInterceptor({
  type: 'serviceAccount',
  serviceAccountJSON: 'sa/227355825121810019.json',
});

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

export const createUserService = (orgId?: string): UserServiceClient => {
  return createClient<UserServiceClient>({
    definition: UserServiceDefinition,
    interceptors: [authorizationInterceptor, createOrgMetadataInterceptor(orgId)],
  });
};

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
