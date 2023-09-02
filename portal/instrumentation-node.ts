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

export type { ClientMiddleware };

if (!process.env.ZITADEL_API_URL) {
  throw new Error('Invalid ZITADEL_API_URL');
}

if (!process.env.ZITADEL_SERVICE_ACCOUNT_TOKEN) {
  throw new Error('Invalid ZITADEL_SERVICE_ACCOUNT_TOKEN');
}

export const getServiceAccount = (params: { orgId?: string; additionalScopes?: string[] } = {}) => {
  const { orgId = '226727705079452014', additionalScopes = [] } = params;

  const file = config[orgId].serviceAccountJSON;
  const saJSON = String(fs.readFileSync(path.resolve(file)));
  const sa = credentials.ServiceAccount.fromJson(JSON.parse(saJSON));

  const authOptions: AuthenticationOptions = {
    apiAccess: true,
  };

  if (additionalScopes.length) {
    authOptions.additionalScopes = additionalScopes;
  }

  return createServiceAccountInterceptor(apiEndpoint, sa, authOptions);
};

export const serviceAccount = getAccessToken(process.env.ZITADEL_SERVICE_ACCOUNT_TOKEN as string);

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

export function OrgMetadata(orgId: string): ClientMiddleware {
  return async function* <Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    options.metadata ??= new Metadata();
    options.metadata.set('x-zitadel-orgid', orgId);
    return yield* call.next(call.request, options);
  };
}

export function createAuthClient(...interceptors: ClientMiddleware[]): AuthServiceClient {
  const channel = createChannel(apiEndpoint);
  let factory = createClientFactory();

  for (const interceptor of interceptors) {
    factory = factory.use(interceptor);
  }

  return factory.create(AuthServiceDefinition, channel);
}

export function createSessionClient(...interceptors: ClientMiddleware[]): SessionServiceClient {
  const channel = createChannel(apiEndpoint);
  let factory = createClientFactory();

  for (const interceptor of interceptors) {
    factory = factory.use(interceptor);
  }

  return factory.create(SessionServiceDefinition, channel);
}

export function createUserClient(...interceptors: ClientMiddleware[]): UserServiceClient {
  const channel = createChannel(apiEndpoint);
  let factory = createClientFactory();

  for (const interceptor of interceptors) {
    factory = factory.use(interceptor);
  }

  return factory.create(UserServiceDefinition, channel);
}

export function createOIDCClient(...interceptors: ClientMiddleware[]): OIDCServiceClient {
  const channel = createChannel(apiEndpoint);
  let factory = createClientFactory();

  for (const interceptor of interceptors) {
    factory = factory.use(interceptor);
  }

  return factory.create(OIDCServiceDefinition, channel);
}

export function createSettingClient(...interceptors: ClientMiddleware[]): SettingsServiceClient {
  const channel = createChannel(apiEndpoint);
  let factory = createClientFactory();

  for (const interceptor of interceptors) {
    factory = factory.use(interceptor);
  }

  return factory.create(SettingsServiceDefinition, channel);
}

export function createManagementServiceClient(...interceptors: ClientMiddleware[]): ManagementServiceClient {
  const channel = createChannel(apiEndpoint);
  let factory = createClientFactory();

  for (const interceptor of interceptors) {
    factory = factory.use(interceptor);
  }

  return factory.create(ManagementServiceDefinition, channel);
}
