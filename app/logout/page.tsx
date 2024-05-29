import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { Session } from '#/types/zitadel';
import { redirect } from 'next/navigation';
import { ROUTING } from '#/lib/router';

export default async ({ searchParams }: any) => {
  const { post_logout_redirect } = searchParams;
  const sessionIds = CookieService.getAllSessions().map((e) => e.sessionId);

  const accessToken = await AuthService.getAdminAccessToken();
  const sessionService = AuthService.createSessionService(accessToken);

  const sessions: Session[] = sessionIds.length
    ? await sessionService
        .listSessions({
          queries: [
            {
              idsQuery: {
                ids: sessionIds,
              },
            },
          ],
        })
        .then((res) => res.sessions || [])
    : [];

  const removeSession = async (session: Session) => {
    const sessionCookie = CookieService.getSessionCookieById(session.id);

    if (sessionCookie) {
      await sessionService.deleteSession({
        sessionId: sessionCookie.sessionId,
        sessionToken: sessionCookie.sessionToken,
      });
    }
  };

  await Promise.allSettled(sessions.map(removeSession));

  if (post_logout_redirect) {
    if (post_logout_redirect === '/ui/login/logout/done') {
      redirect(ROUTING.LOGIN);
    }

    redirect(post_logout_redirect);
  }

  redirect(ROUTING.LOGIN);
};
