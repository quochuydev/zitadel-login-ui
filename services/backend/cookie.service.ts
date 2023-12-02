import { cookies } from 'next/headers';
import configuration from '#/configuration';

type SessionCookie = {
  sessionId: string;
  sessionToken: string;
  userId: string;
};

function atob(base64: string) {
  return Buffer.from(base64, 'base64').toString('binary');
}

function btoa(binary: string) {
  return Buffer.from(binary, 'binary').toString('base64');
}

const stringify = (cookies: SessionCookie[]): string => {
  return btoa(JSON.stringify(cookies));
};

const parse = (stringified?: string): SessionCookie[] => {
  try {
    return stringified ? JSON.parse(atob(stringified)) : [];
  } catch (error) {
    return [];
  }
};

const SESSION_COOKIE_NAME = 'sessions';
const SESSION_COOKIE_CHUNK_SIZE = 2000;

function getAllSessions(): SessionCookie[] {
  const requestCookie = cookies();
  const cookieList = requestCookie.getAll();

  const chunks: Array<{ name: string; value: string }> = [];

  for (const cookie of cookieList) {
    if (cookie.name.startsWith(SESSION_COOKIE_NAME)) {
      chunks.push(cookie);
    }
  }

  const stringified = sortChunks(chunks)
    .map((e) => e.value)
    .join('');

  return parse(stringified).filter((e) => !!e.sessionId);
}

function sortChunks(cookies: Array<{ name: string; value: string }>) {
  const compare = (a: string, b: string) => {
    const numA = Number(a.split('.')[1] || 0);
    const numB = Number(b.split('.')[1] || 0);
    return numA - numB;
  };

  return cookies.sort((a, b) => compare(a.name, b.name));
}

function splitTextIntoChunks(
  text: string,
  chunkSize = SESSION_COOKIE_CHUNK_SIZE,
) {
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}

function setSessionHttpOnlyCookie(sessions: SessionCookie[]) {
  const requestCookie = cookies();
  const value = stringify(sessions.slice(0, 5));
  const textChunks = splitTextIntoChunks(value);

  for (let index = 0; index < textChunks.length; index++) {
    const name =
      index === 0 ? SESSION_COOKIE_NAME : `${SESSION_COOKIE_NAME}.${index}`;

    requestCookie.set({
      name,
      value: textChunks[index],
      sameSite: 'lax',
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30d
      secure: configuration.server !== 'local',
      domain: new URL(configuration.appUrl).hostname,
    });
  }
}

async function addSessionToCookie(session: SessionCookie) {
  let currentSessions = getAllSessions();
  const index = currentSessions.findIndex((s) => s.userId === session.userId);

  if (index > -1) {
    currentSessions[index] = session;
  } else {
    currentSessions = [session, ...currentSessions];
  }

  setSessionHttpOnlyCookie(currentSessions.filter((e) => !!e));
}

async function updateSessionCookie(sessionId: string, session: SessionCookie) {
  const sessions = getAllSessions();

  const currentSessions = sessions.length ? sessions : [session];
  const index = currentSessions.findIndex((e) => e.sessionId === sessionId);

  if (index > -1) {
    currentSessions[index] = session;
    setSessionHttpOnlyCookie(currentSessions);
  }
}

function removeSessionFromCookie(sessionId: string) {
  const sessions = getAllSessions();
  const filteredSessions = sessions.filter((s) => s.sessionId !== sessionId);
  setSessionHttpOnlyCookie(filteredSessions);
}

function getSessionCookieByUserId(userId: string) {
  const sessions = getAllSessions();
  return sessions.find((s) => s.userId === userId);
}

function getSessionCookieById(id: string) {
  const sessions = getAllSessions();
  return sessions.find((s) => s.sessionId === id);
}

export type { SessionCookie };
export default {
  setSessionHttpOnlyCookie,
  addSessionToCookie,
  updateSessionCookie,
  removeSessionFromCookie,
  getAllSessions,
  getSessionCookieById,
  getSessionCookieByUserId,
};
