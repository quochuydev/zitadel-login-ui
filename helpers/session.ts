import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { Session } from '#/types/zitadel';

export async function getCurrentSessions() {
  const sessionIds = CookieService.getAllSessions().map((e) => e.sessionId);

  if (!sessionIds.length) {
    return [];
  }

  const accessToken = await AuthService.getAdminAccessToken();

  const sessionService = await AuthService.createSessionService(accessToken);

  const sessions: Session[] = await sessionService
    .listSessions({
      queries: [
        {
          idsQuery: {
            ids: sessionIds,
          },
        },
      ],
    })
    .then((res) => res.sessions || []);

  return sessions.sort((a, b) =>
    new Date(a.creationDate).getTime() < new Date(b.creationDate).getTime()
      ? 1
      : -1,
  );
}
