import { createChannel, createClientFactory, CallOptions, ClientMiddleware, ClientMiddlewareCall } from 'nice-grpc';
import { Metadata } from 'nice-grpc-common';
import fs from 'fs';
import path from 'path';
import { credentials } from '@zitadel/node';
import { config, apiEndpoint } from '@/config';

import type { UserServiceClient } from '@/zitadel-server/proto/zitadel/user/v2alpha/user_service';
import { UserServiceDefinition } from '@/zitadel-server/proto/zitadel/user/v2alpha/user_service';
import type { SessionServiceClient } from '@/zitadel-server/proto/zitadel/session/v2alpha/session_service';
import { SessionServiceDefinition } from '@/zitadel-server/proto/zitadel/session/v2alpha/session_service';
import type { OIDCServiceClient } from '@/zitadel-server/proto/zitadel/oidc/v2alpha/oidc_service';
import { OIDCServiceDefinition } from '@/zitadel-server/proto/zitadel/oidc/v2alpha/oidc_service';
import { AuthServiceDefinition } from '@/zitadel-server/proto/zitadel/auth';
import type { AuthServiceClient } from '@/zitadel-server/proto/zitadel/auth';
import { AuthenticationOptions, ServiceAccount } from '@zitadel/node/dist/credentials/service-account';
import { SettingsServiceDefinition } from '@/zitadel-server/proto/zitadel/settings/v2alpha/settings_service';
import type { SettingsServiceClient } from '@/zitadel-server/proto/zitadel/settings/v2alpha/settings_service';
import type { ManagementServiceClient } from '@/zitadel-server/proto/zitadel/management';
import { ManagementServiceDefinition } from '@/zitadel-server/proto/zitadel/management';
import { CompatServiceDefinition } from 'nice-grpc/lib/service-definitions';

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

export function getAccessToken(token: string) {
  return createAccessTokenInterceptor(token);
}

export function createAccessTokenInterceptor(token: string): ClientMiddleware {
  return async function* <Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    options.metadata ??= new Metadata();

    if (!options.metadata.has('authorization')) {
      options.metadata.set('authorization', `Bearer ${token}`);
    }

    return yield* call.next(call.request, options);
  };
}

export function createServiceAccountInterceptor(
  audience: string,
  serviceAccount: ServiceAccount,
  authOptions?: AuthenticationOptions,
): ClientMiddleware {
  let token: string | undefined;
  let expiryDate = new Date(0);

  return async function* <Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    options.metadata ??= new Metadata();

    if (!options.metadata.has('authorization')) {
      if (expiryDate < new Date()) {
        console.log(`Need to create new token for org:`, authOptions);
        token = await serviceAccount.authenticate(audience, authOptions);
        expiryDate.setTime(new Date().getTime() + 59 * 60 * 1000);
      }
      options.metadata.set('authorization', `Bearer ${token}`);
    }

    return yield* call.next(call.request, options);
  };
}

export function OrgMetadata(orgId?: string): ClientMiddleware {
  return async function* <Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    options.metadata ??= new Metadata();

    if (orgId) {
      options.metadata.set('x-zitadel-orgid', orgId);
    }

    return yield* call.next(call.request, options);
  };
}

export function createClient<T>(params: { definition: CompatServiceDefinition; interceptors: ClientMiddleware[] }): T {
  const { definition, interceptors } = params;

  const channel = createChannel(apiEndpoint);
  let factory = createClientFactory();

  for (const interceptor of interceptors) {
    factory = factory.use(interceptor);
  }

  return factory.create(definition, channel) as T;
}

export const createUserService = (params: { orgId?: string } = {}): UserServiceClient => {
  const { orgId } = params;
  const interceptors: ClientMiddleware[] = [serviceAccount, OrgMetadata(orgId)];

  const service = createClient<UserServiceClient>({
    definition: UserServiceDefinition,
    interceptors,
  });

  return service;
};

export function createSessionService(params: { orgId?: string } = {}): SessionServiceClient {
  const { orgId } = params;
  const interceptors: ClientMiddleware[] = [serviceAccount, OrgMetadata(orgId)];

  const service = createClient<SessionServiceClient>({
    definition: SessionServiceDefinition,
    interceptors,
  });

  return service;
}

export function createOIDCService(params: { orgId?: string } = {}): OIDCServiceClient {
  const { orgId } = params;
  const interceptors: ClientMiddleware[] = [serviceAccount, OrgMetadata(orgId)];

  const service = createClient<OIDCServiceClient>({
    definition: OIDCServiceDefinition,
    interceptors,
  });

  return service;
}

export function createSettingService(params: { orgId?: string } = {}): SettingsServiceClient {
  const { orgId } = params;
  const interceptors: ClientMiddleware[] = [serviceAccount, OrgMetadata(orgId)];

  return createClient<SettingsServiceClient>({
    definition: SettingsServiceDefinition,
    interceptors,
  });
}

export function createManagementService(params: { orgId?: string } = {}): ManagementServiceClient {
  const { orgId } = params;
  const interceptors: ClientMiddleware[] = [serviceAccount, OrgMetadata(orgId)];

  return createClient<ManagementServiceClient>({
    definition: ManagementServiceDefinition,
    interceptors,
  });
}

export function createAuthService(params: { orgId?: string } = {}): AuthServiceClient {
  const { orgId } = params;
  const interceptors: ClientMiddleware[] = [serviceAccount, OrgMetadata(orgId)];

  return createClient<AuthServiceClient>({
    definition: AuthServiceDefinition,
    interceptors,
  });
}
