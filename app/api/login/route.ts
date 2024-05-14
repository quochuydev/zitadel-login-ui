import { defaultHandler, isValidRequest } from '#/helpers/api-handler';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APILogin } from '#/types/api';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
  authRequestId: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APILogin>(
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

      const { username: loginName, password, authRequestId } = body;

      const accessToken = await AuthService.getAdminAccessToken();
      const sessionService = AuthService.createSessionService(accessToken);
      const userService = AuthService.createUserService(accessToken);

      const newSession = await sessionService.createSession({
        checks: {
          user: {
            loginName,
          },
          password: {
            password,
          },
        },
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

      const user = await userService.getUserById(userId);
      if (!user) throw new Error('user not found');

      const changeRequired = user.user?.human?.passwordChangeRequired;

      const result: APILogin['result'] = {
        changeRequired,
        userId,
      };

      if (authRequestId) {
        if (!changeRequired) {
          const oidcService = AuthService.createOIDCService(accessToken);

          const callbackResult = await oidcService.createCallback({
            authRequestId,
            session: {
              sessionId: newSession.sessionId,
              sessionToken: newSession.sessionToken,
            },
          });

          result.callbackUrl = callbackResult.callbackUrl;
        }
      }

      return result;
    },
  );
}
