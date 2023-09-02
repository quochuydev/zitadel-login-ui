import { config } from './config';
import { combine, create } from '@submodule/core';
import { grpc, credentials } from '@zitadel/node';
import * as fs from 'fs';
import * as path from 'path';
import { Metadata } from 'nice-grpc-common';
import { CallOptions, ClientMiddleware, ClientMiddlewareCall } from 'nice-grpc';

export function OrgMetadata(orgId: string): ClientMiddleware {
  return async function* <Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions) {
    options.metadata ??= new Metadata();
    options.metadata.set('x-zitadel-orgid', orgId);
    return yield* call.next(call.request, options);
  };
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

export function getAccessToken(token: string) {
  return createAccessTokenInterceptor(token);
}

const serviceAccount = create((config) => {
  const file = config.zitadel.serviceAccountJSON;
  const saJSON = String(fs.readFileSync(path.resolve(file)));
  const sa = credentials.ServiceAccount.fromJson(JSON.parse(saJSON));

  return grpc.createServiceAccountInterceptor(config.zitadel.apiEndpoint, sa, {
    apiAccess: true,
    additionalScopes: [],
  });
}, config);

export const admin = create(({ config, serviceAccount }) => {
  return grpc.createAdminClient(config.zitadel.apiEndpoint, serviceAccount);
}, combine({ config, serviceAccount }));

export const manager = create(({ config, serviceAccount }) => {
  return grpc.createManagementClient(config.zitadel.apiEndpoint, serviceAccount);
}, combine({ config, serviceAccount }));

export const auth = create(({ config, serviceAccount }) => {
  return grpc.createAuthClient(config.zitadel.apiEndpoint, serviceAccount);
}, combine({ config, serviceAccount }));

export const createAuthClient = create(({ config, serviceAccount }) => {
  return (orgId?: string) => {
    const interceptors: ClientMiddleware[] = [serviceAccount];

    if (orgId) {
      interceptors.push(OrgMetadata(orgId));
    }

    return grpc.createAuthClient(config.zitadel.apiEndpoint, ...interceptors);
  };
}, combine({ config, serviceAccount }));

export const createManagerClient = create(({ config, serviceAccount }) => {
  return (orgId?: string) => {
    const interceptors: ClientMiddleware[] = [serviceAccount];

    if (orgId) {
      interceptors.push(OrgMetadata(orgId));
    }

    return grpc.createManagementClient(config.zitadel.apiEndpoint, ...interceptors);
  };
}, combine({ config, serviceAccount }));

export const client = combine({ admin, manager, auth, config, createAuthClient, createManagerClient });
