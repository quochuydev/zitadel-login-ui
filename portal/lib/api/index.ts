import { appUrl } from '@/config';

export async function startIdpIntent(orgId: string, data: object) {
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

export async function retrieveIntent(orgId: string, data: any): Promise<any> {
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

export async function login(orgId: string, data: any): Promise<any> {
  const session = await fetch(`${appUrl}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'org-id': orgId,
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());

  return session;
}

export async function register(orgId: string, userData: any) {
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

export async function finalizeAuthRequest(params: {
  orgId: string;
  authRequestId: string;
  session: {
    sessionId: string;
    sessionToken: string;
  };
}): Promise<{
  callbackUrl: string;
}> {
  const { orgId, authRequestId, session } = params;

  const result = await fetch(`${appUrl}/api/auth_request/finalize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'org-id': orgId,
    },
    body: JSON.stringify({
      authRequestId,
      session: {
        sessionId: session.sessionId,
        sessionToken: session.sessionToken,
      },
    }),
  }).then((res) => res.json());

  return result;
}
