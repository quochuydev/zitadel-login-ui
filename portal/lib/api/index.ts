import { appUrl } from '@/config';

export async function startIdpIntents(orgId: string, data: object) {
  const result = await fetch(`/api/idp/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'org-id': orgId,
    },
    body: JSON.stringify({ ...data }),
  }).then((res) => res.json());

  console.log('result', result);

  return result;
}

export async function getIntent(orgId: string, data: any): Promise<any> {
  const result = await fetch(`${appUrl}/api/idp/get-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'org-id': orgId,
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());

  console.log('intent', result);

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

  console.log('session', session);

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

  console.log('session', session);

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

  const result = await fetch(`${appUrl}/api/oidc/auth_requests`, {
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

  console.log('result', result, result.callbackUrl);

  return result;
}
