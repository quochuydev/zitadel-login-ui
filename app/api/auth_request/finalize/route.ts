import type { NextRequest } from 'next/server';
import AuthService from '#/services/backend/auth.service';
import type { APIFinalizeAuthRequest } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/helpers/api-handler';
import CookieService from '#/services/backend/cookie.service';
import * as z from 'zod';

const schema = z.object({
  authRequestId: z.string().trim(),
  userId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIFinalizeAuthRequest>(
    {
      request,
      tracingName: 'finalize auth request',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { authRequestId, userId } = body;

      const sessionCookie = CookieService.getSessionCookieByUserId(userId);

      if (!sessionCookie) {
        throw new Error('Session not found');
      }

      const accessToken = await AuthService.getAdminAccessToken();

      const oidcService = AuthService.createOIDCService(accessToken);

      const result = await oidcService.createCallback({
        authRequestId,
        session: {
          sessionId: sessionCookie.sessionId,
          sessionToken: sessionCookie.sessionToken,
        },
      });

      return {
        callbackUrl: result.callbackUrl,
      };
    },
  );
}
