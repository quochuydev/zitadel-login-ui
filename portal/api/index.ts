import { appUrl } from '@/config';
import { AuthRequest } from '@/zitadel-server/proto/zitadel/oidc/v2beta/authorization';
import { IDPInformation } from '@/zitadel-server';
import {
  AddHumanUserRequest,
  RetrieveIdentityProviderIntentRequest,
  StartIdentityProviderIntentRequest,
} from '@/zitadel-server/proto/zitadel/user/v2beta/user_service';
import { CreateCallbackRequest } from '@/zitadel-server/proto/zitadel/oidc/v2beta/oidc_service';
import { CreateSessionRequest, DeleteSessionRequest } from '@/zitadel-server/proto/zitadel/session/v2beta/session_service';

export async function startIdpIntent(orgId: string, data: StartIdentityProviderIntentRequest) {
  const result = await fetch(`/api/intents/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'org-id': orgId,
    },
    body: JSON.stringify({ ...data }),
  }).then((res) => res.json());

  return result;
}

export async function retrieveIntent(orgId: string, data: RetrieveIdentityProviderIntentRequest): Promise<IDPInformation> {
  const result = await fetch(`${appUrl}/api/intents/retrieve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'org-id': orgId,
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());

  return result;
}

export async function login(orgId: string, data: Partial<CreateSessionRequest>): Promise<any> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (orgId) {
    headers['org-id'] = orgId;
  }

  const session = await fetch(`${appUrl}/api/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then((response) => response.json());

  return session;
}

export async function register(orgId: string, userData: Partial<AddHumanUserRequest>) {
  const session = await fetch(`${appUrl}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'org-id': orgId,
    },
    body: JSON.stringify(userData),
  }).then((res) => res.json());

  return session;
}

export async function retrieveAuthRequest(params: { authRequestId: string }): Promise<AuthRequest> {
  const { authRequestId } = params;

  const result = await fetch(`${appUrl}/api/auth_request/retrieve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authRequestId,
    }),
  }).then((res) => res.json());

  return result;
}

export async function finalizeAuthRequest(
  orgId: string,
  params: CreateCallbackRequest,
): Promise<{
  callbackUrl: string;
}> {
  const { authRequestId, session } = params;

  const result = await fetch(`${appUrl}/api/auth_request/finalize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'org-id': orgId,
    },
    body: JSON.stringify({
      authRequestId,
      session,
    }),
  }).then((res) => res.json());

  return result;
}

export async function logout(data: Partial<DeleteSessionRequest>): Promise<any> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const result = await fetch(`${appUrl}/api/logout`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then((response) => response.json());

  return result;
}
