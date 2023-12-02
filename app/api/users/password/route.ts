import type { NextRequest } from 'next/server';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APIChangePassword } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/helpers/api-handler';
import * as z from 'zod';

const schema = z.object({
  currentPassword: z.string().trim(),
  newPassword: z.string().trim(),
  sessionId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIChangePassword>(
    {
      request,
      tracingName: 'update password',
    },
    async (body) => {
      const sessionId = request.headers.get('x-portal-session-id') as string;

      isValidRequest({
        data: {
          ...body,
          sessionId,
        },
        schema,
      });

      const { currentPassword, newPassword } = body;

      const session = CookieService.getSessionCookieById(sessionId);

      if (!session) {
        throw new Error('Session not found');
      }

      const authService = await AuthService.createAuthService(
        session.sessionToken,
      );

      await authService.changePassword({
        oldPassword: currentPassword,
        newPassword,
      });
    },
  );
}
