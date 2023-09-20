import { CallOptions, ClientMiddleware, ClientMiddlewareCall } from 'nice-grpc';
import { Metadata } from 'nice-grpc-common';
import fs from 'fs';
import path from 'path';
import { credentials } from '@zitadel/node';
import { apiEndpoint } from '@/config';
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
import {
  createAuthorizationInterceptor,
  createClient,
  createOrgMetadataInterceptor,
  createServiceAccountInterceptor,
} from './app-service';

export type { ClientMiddleware };

if (!process.env.ZITADEL_API_URL) {
  throw new Error('Invalid ZITADEL_API_URL');
}

export const getServiceAccount = () => {
  const file = 'sa/227355825121810019.json';
  const saJSON = String(fs.readFileSync(path.resolve(file)));
  const sa = credentials.ServiceAccount.fromJson(JSON.parse(saJSON));

  return createServiceAccountInterceptor(apiEndpoint, sa, {
    apiAccess: true,
  });
};

export const serviceAccount = getServiceAccount();

export function createAccessTokenInterceptor(token: string): ClientMiddleware {
  return async function* <Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    options.metadata ??= new Metadata();

    if (!options.metadata.has('authorization')) {
      options.metadata.set('authorization', `Bearer ${token}`);
    }

    return yield* call.next(call.request, options);
  };
}

export const createUserService = (orgId?: string): UserServiceClient => {
  const interceptors: ClientMiddleware[] = [serviceAccount, createOrgMetadataInterceptor(orgId)];

  const service = createClient<UserServiceClient>({
    definition: UserServiceDefinition,
    interceptors,
  });

  return service;
};

export function createSessionService(orgId?: string): SessionServiceClient {
  const interceptors: ClientMiddleware[] = [serviceAccount, createOrgMetadataInterceptor(orgId)];

  const service = createClient<SessionServiceClient>({
    definition: SessionServiceDefinition,
    interceptors,
  });

  return service;
}

export function createOIDCService(orgId?: string): OIDCServiceClient {
  const interceptors: ClientMiddleware[] = [serviceAccount, createOrgMetadataInterceptor(orgId)];

  const service = createClient<OIDCServiceClient>({
    definition: OIDCServiceDefinition,
    interceptors,
  });

  return service;
}

export function createSettingService(orgId?: string): SettingsServiceClient {
  const interceptors: ClientMiddleware[] = [serviceAccount, createOrgMetadataInterceptor(orgId)];

  return createClient<SettingsServiceClient>({
    definition: SettingsServiceDefinition,
    interceptors,
  });
}

const authorizationInterceptor = createAuthorizationInterceptor({
  type: 'serviceAccount',
  serviceAccountJSON: 'sa/227355825121810019.json',
});

export function createManagementService(options: { orgId: string }): ManagementServiceClient {
  const { orgId } = options;

  return createClient<ManagementServiceClient>({
    definition: ManagementServiceDefinition,
    interceptors: [authorizationInterceptor, createOrgMetadataInterceptor(orgId)],
  });
}

export function createAuthService(orgId?: string): AuthServiceClient {
  const interceptors: ClientMiddleware[] = [serviceAccount, createOrgMetadataInterceptor(orgId)];

  return createClient<AuthServiceClient>({
    definition: AuthServiceDefinition,
    interceptors,
  });
}
