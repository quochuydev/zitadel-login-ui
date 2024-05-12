import type { NextRequest } from 'next/server';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APILogin } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/helpers/api-handler';
import * as z from 'zod';

const schema = z.object({
  username: z.string().trim(),
  // password: z.string().trim(),
  authRequestId: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APILogin>({ request }, async (body) => {
    isValidRequest({
      data: {
        ...body,
      },
      schema,
    });

    const { username: loginName, webAuthN } = body;

    const accessToken = await AuthService.getAdminAccessToken();
    const sessionService = AuthService.createSessionService(accessToken);

    const dataChecks = {
      user: {
        loginName,
      },
    };

    const sessionData = {
      checks: dataChecks,
      webAuthN,
    };

    const newSession = await sessionService.createSession(sessionData);

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

    const result: APILogin['result'] = {
      changeRequired: false,
      userId,
      challenges: undefined,
    };

    return result;
  });
}
