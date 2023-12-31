import { cookies } from 'next/headers';

export type SessionCookie = {
  sessionId: string;
  sessionToken: string;
  userId: string;
};

function setSessionHttpOnlyCookie(sessions: SessionCookie[]) {
  const cookiesList = cookies();

  return cookiesList.set({
    name: 'sessions',
    value: JSON.stringify(sessions),
    httpOnly: true,
    path: '/',
    domain: '.example.local',
    // sameSite: 'none',
  });
}

export async function addSessionToCookie(session: SessionCookie) {
  const cookiesList = cookies();
  const stringifiedCookie = cookiesList.get('sessions');

  let currentSessions: SessionCookie[] = stringifiedCookie?.value ? JSON.parse(stringifiedCookie?.value) : [];
  const index = currentSessions.findIndex((s) => s.userId === session.userId);

  if (index > -1) {
    currentSessions[index] = session;
  } else {
    currentSessions = [...currentSessions, session];
  }

  return setSessionHttpOnlyCookie(currentSessions.filter((e) => !!e));
}

export async function updateSessionCookie(sessionId: string, session: SessionCookie): Promise<any> {
  const cookiesList = cookies();
  const stringifiedCookie = cookiesList.get('sessions');

  const sessions: SessionCookie[] = stringifiedCookie?.value ? JSON.parse(stringifiedCookie?.value) : [session];

  const foundIndex = sessions.findIndex((session) => session.sessionId === sessionId);
  if (foundIndex > -1) {
    sessions[foundIndex] = session;
    return setSessionHttpOnlyCookie(sessions);
  } else {
    throw 'updateSessionCookie: session id now found';
  }
}

export function removeSessionFromCookie(sessionId: string) {
  const cookiesList = cookies();
  const stringifiedCookie = cookiesList.get('sessions');

  const sessions: SessionCookie[] = stringifiedCookie?.value ? JSON.parse(stringifiedCookie?.value) : [];

  const filteredSessions = sessions.filter((s) => s.sessionId !== sessionId);

  return setSessionHttpOnlyCookie(filteredSessions);
}

export function getSessionCookieById(id: string): SessionCookie {
  const cookiesList = cookies();
  const stringifiedCookie = cookiesList.get('sessions');

  if (!stringifiedCookie?.value) {
    throw new Error();
  }

  const sessions: SessionCookie[] = JSON.parse(stringifiedCookie?.value);

  const found = sessions.find((s) => s.sessionId === id);

  return found;
}

export async function getSessionCookieByLoginName(userId: string): Promise<SessionCookie> {
  const cookiesList = cookies();
  const stringifiedCookie = cookiesList.get('sessions');

  if (stringifiedCookie?.value) {
    const sessions: SessionCookie[] = JSON.parse(stringifiedCookie?.value);

    const found = sessions.find((s) => s.userId === userId);
    if (found) {
      return found;
    } else {
      return Promise.reject('no cookie found with userId: ' + userId);
    }
  } else {
    return Promise.reject('no session cookie found');
  }
}

export async function getAllSessionIds(): Promise<any> {
  const cookiesList = cookies();
  const stringifiedCookie = cookiesList.get('sessions');

  if (stringifiedCookie?.value) {
    const sessions: SessionCookie[] = JSON.parse(stringifiedCookie?.value);
    return sessions.map((session) => session.sessionId);
  } else {
    return [];
  }
}

export function getAllSessions(): SessionCookie[] {
  const cookiesList = cookies();
  const stringifiedCookie = cookiesList.get('sessions');

  if (stringifiedCookie?.value) {
    const sessions: SessionCookie[] = JSON.parse(stringifiedCookie?.value);
    return sessions;
  } else {
    return [];
  }
}

export async function clearSessions() {}
