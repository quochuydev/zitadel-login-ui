import type { NextRequest } from 'next/server';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APIStartPasskey } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/lib/api-handler';
import * as z from 'zod';

const schema = z.object({
  authRequestId: z.string().trim().optional(),
  username: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIStartPasskey>(
    {
      request,
      tracingName: 'login',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { username: loginName, challenges } = body;

      const accessToken = await AuthService.getAdminAccessToken();
      const sessionService = AuthService.createSessionService(accessToken);

      const dataChecks: any = {
        user: {
          loginName,
        },
      };

      const newSession = await sessionService.createSession({
        checks: dataChecks,
        challenges: challenges,
      });

      console.log('newSession', newSession);

      const session = await sessionService.getSession({
        sessionId: newSession.sessionId,
      });

      console.log('session', session);
      if (!session?.factors?.user) throw new Error('Invalid session');

      const userId = session.factors.user.id;

      CookieService.addSessionToCookie({
        sessionId: newSession.sessionId,
        sessionToken: newSession.sessionToken,
        userId,
      });

      return {
        changeRequired: false,
        userId,
        challenges: newSession.challenges,
      };
    },
  );
}
