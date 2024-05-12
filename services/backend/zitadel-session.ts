import CookieService from '#/services/backend/cookie.service';
import AuthService from '#/services/backend/auth.service';
import type { Session } from '#/types/zitadel';

export async function getCurrentSessions() {
  const sessionIds = CookieService.getAllSessions().map((e) => e.sessionId);
  if (!sessionIds.length) return [];

  const accessToken = await AuthService.getAdminAccessToken();
  const sessionService = AuthService.createSessionService(accessToken);

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

  return sessions.sort((a, b) => {
    const _a = new Date(a.creationDate as Date).getTime();
    const _b = new Date(b.creationDate as Date).getTime();
    return _a < _b ? 1 : -1;
  });
}
