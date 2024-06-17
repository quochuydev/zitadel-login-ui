import { defaultHandler, ErrorCode, isValidRequest } from '#/lib/api-handler';
import CookieService from '#/services/backend/cookie.service';
import AuthService from '#/services/backend/auth.service';
import type { APILoginExternal } from '#/types/api';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  idpIntentId: z.string().trim(),
  idpIntentToken: z.string().trim(),
  userId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APILoginExternal>(
    {
      request,
      tracingName: 'login external',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { userId, idpIntentId, idpIntentToken } = body;

      const accessToken = await AuthService.getAdminAccessToken();
      const sessionService = AuthService.createSessionService(accessToken);

      const newSession = await sessionService.createSession({
        checks: {
          user: {
            userId,
          },
          idpIntent: {
            idpIntentId,
            idpIntentToken,
          },
        },
      });

      const session = await sessionService.getSession({
        sessionId: newSession.sessionId,
      });
      const userOrgId = session?.factors?.user?.organizationId;

      if (!userOrgId) {
        throw {
          code: 401,
          errors: {
            code: ErrorCode.UNAUTHORIZED,
          },
        };
      }

      CookieService.addSessionToCookie({
        sessionId: newSession.sessionId,
        sessionToken: newSession.sessionToken,
        userId,
      });
    },
  );
}
