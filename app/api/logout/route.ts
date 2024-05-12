import type { NextRequest } from 'next/server';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APILogout } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/helpers/api-handler';
import * as z from 'zod';

const schema = z.object({
  sessionId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APILogout>(
    {
      request,
      tracingName: 'logout',
    },
    async (body) => {
      isValidRequest<APILogout['data']>({
        data: {
          ...body,
        },
        schema,
      });

      const { sessionId } = body;

      const sessionCookie = CookieService.getSessionCookieById(sessionId);

      if (!sessionCookie) {
        throw new Error('Session not found');
      }

      const accessToken = await AuthService.getAdminAccessToken();
      const sessionService = AuthService.createSessionService(accessToken);

      await sessionService.deleteSession({
        sessionId: sessionCookie.sessionId,
        sessionToken: sessionCookie.sessionToken,
      });

      CookieService.removeSessionFromCookie(sessionId);
    },
  );
}
