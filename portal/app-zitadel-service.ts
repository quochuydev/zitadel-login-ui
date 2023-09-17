import { createChannel, createClientFactory, CallOptions, ClientMiddleware, ClientMiddlewareCall } from 'nice-grpc';
import { Metadata } from 'nice-grpc-common';
import { apiEndpoint } from '@/config';
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

export function createAccessTokenByClientInterceptor(clientId: string, clientSecret: string): ClientMiddleware {
  return async function* <Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    const searchParams = new URLSearchParams();
    searchParams.append('grant_type', 'client_credentials');
    searchParams.append('client_id', clientId);
    searchParams.append('client_secret', clientSecret);
    searchParams.append('scope', 'openid profile email urn:zitadel:iam:org:project:id:zitadel:aud');

    const result: {
      access_token: string;
      token_type: string;
      refresh_token: string;
      expires_in: number;
      id_token: string;
    } = await fetch(`https://portal.example.local/oauth/v2/token`, {
      method: 'POST',
      body: searchParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => res.json());

    console.log('result', result);
    const token = result.access_token;

    options.metadata ??= new Metadata();
    options.metadata.set('authorization', `Bearer ${token}`);

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

export function createManagementService(params: {
  orgId: string;
  clientId: string;
  clientSecret: string;
}): ManagementServiceClient {
  const { orgId, clientId, clientSecret } = params;

  const interceptors: ClientMiddleware[] = [
    createAccessTokenByClientInterceptor(clientId, clientSecret),
    OrgMetadata(orgId),
  ];

  return createClient<ManagementServiceClient>({
    definition: ManagementServiceDefinition,
    interceptors,
  });
}
