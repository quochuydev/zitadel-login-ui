import { defaultHandler, isValidRequest } from '#/lib/api-handler';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APILoginPasskey } from '#/types/api';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  username: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APILoginPasskey>({ request }, async (body) => {
    isValidRequest({
      data: {
        ...body,
      },
      schema,
    });

    const { username: loginName, webAuthN } = body;

    const accessToken = await AuthService.getAdminAccessToken();
    const sessionService = AuthService.createSessionService(accessToken);

    const newSession = await sessionService.createSession({
      checks: {
        user: {
          loginName,
        },
      },
      webAuthN,
    });

    const session = await sessionService.getSession({
      sessionId: newSession.sessionId,
    });

    if (!session?.factors?.user) throw new Error('Invalid session');

    const userId = session.factors.user.id;

    CookieService.addSessionToCookie({
      sessionId: newSession.sessionId,
      sessionToken: newSession.sessionToken,
      userId,
    });

    const result: APILoginPasskey['result'] = {
      userId,
    };

    return result;
  });
}
