import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { createChannel, createClientFactory, CallOptions, ClientMiddleware, ClientMiddlewareCall } from 'nice-grpc';
import { Metadata } from 'nice-grpc-common';
import { CompatServiceDefinition } from 'nice-grpc/lib/service-definitions';
import { AuthenticationOptions, ServiceAccount } from '@zitadel/node/dist/credentials/service-account';
import type { ManagementServiceClient } from '@/zitadel-server/proto/zitadel/management';
import { ManagementServiceDefinition } from '@/zitadel-server/proto/zitadel/management';
import { credentials } from '@zitadel/node';
import { apiEndpoint, appUrl } from '@/config';

export type { ClientMiddleware };

if (!apiEndpoint) {
  throw new Error('Invalid ZITADEL_API_URL');
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

export function createClientCredentialsInterceptor(clientId: string, clientSecret: string): ClientMiddleware {
  return async function* <Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    const searchParams = new URLSearchParams();
    searchParams.append('grant_type', 'client_credentials');
    searchParams.append('client_id', clientId);
    searchParams.append('client_secret', clientSecret);
    searchParams.append('scope', 'openid profile email urn:zitadel:iam:org:project:id:zitadel:aud');

    const result = await fetch(`${appUrl}/oauth/v2/token`, {
      method: 'POST',
      body: searchParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(async (response) => {
      const res = (await response.json()) as {
        access_token: string;
        token_type: string;
        refresh_token: string;
        expires_in: number;
        id_token: string;
      };

      return res;
    });

    console.log('result', result);
    const token = result.access_token;

    options.metadata ??= new Metadata();

    if (token) {
      options.metadata.set('authorization', `Bearer ${token}`);
    }

    return yield* call.next(call.request, options);
  };
}

export function createOrgMetadataInterceptor(orgId?: string): ClientMiddleware {
  return async function* <Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    options.metadata ??= new Metadata();

    if (orgId) {
      options.metadata.set('x-zitadel-orgid', orgId);
    }

    return yield* call.next(call.request, options);
  };
}

export type AuthorizationInterceptorParams =
  | {
      type: 'clientCredentials';
      clientId: string;
      clientSecret: string;
    }
  | {
      type: 'token';
      token: string;
    }
  | {
      type: 'serviceAccount';
      serviceAccountJSON: string;
    };

export function createAuthorizationInterceptor(params: AuthorizationInterceptorParams) {
  const { type } = params;

  if (type === 'clientCredentials') {
    const { clientId, clientSecret } = params;
    return createClientCredentialsInterceptor(clientId, clientSecret);
  }

  if (type === 'serviceAccount') {
    const { serviceAccountJSON } = params;
    const saJSON = String(fs.readFileSync(path.resolve(serviceAccountJSON)));
    const sa = credentials.ServiceAccount.fromJson(JSON.parse(saJSON));
    const authOptions: AuthenticationOptions = { apiAccess: true };
    return createServiceAccountInterceptor(apiEndpoint, sa, authOptions);
  }

  if (type === 'token') {
    const { token } = params;
    return createAccessTokenInterceptor(token);
  }

  throw new Error(`Invalid authorization type: ${type}`);
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
