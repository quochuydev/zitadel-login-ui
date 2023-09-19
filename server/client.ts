import { config } from './config';
import { grpc, credentials } from '@zitadel/node';
import * as fs from 'fs';
import * as path from 'path';
import { Metadata } from 'nice-grpc-common';
import { CallOptions, ClientMiddleware, ClientMiddlewareCall } from 'nice-grpc';

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

const serviceAccount = (config) => {
  const file = config.zitadel.serviceAccountJSON;
  const saJSON = String(fs.readFileSync(path.resolve(file)));
  const sa = credentials.ServiceAccount.fromJson(JSON.parse(saJSON));

  return grpc.createServiceAccountInterceptor(config.zitadel.apiEndpoint, sa, {
    apiAccess: true,
    additionalScopes: [],
  });
};

export const admin = ({ config, serviceAccount }) => {
  return grpc.createAdminClient(config.zitadel.apiEndpoint, serviceAccount);
};

export const manager = ({ config, serviceAccount }) => {
  return grpc.createManagementClient(config.zitadel.apiEndpoint, serviceAccount);
};

export const auth = ({ config, serviceAccount }) => {
  return grpc.createAuthClient(config.zitadel.apiEndpoint, serviceAccount);
};

export const client = { config, admin, manager, auth };
