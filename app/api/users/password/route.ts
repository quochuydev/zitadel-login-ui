import type { NextRequest } from 'next/server';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APIChangePassword } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/helpers/api-handler';
import * as z from 'zod';

const schema = z.object({
  currentPassword: z.string().trim(),
  newPassword: z.string().trim(),
  userId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIChangePassword>(
    {
      request,
      tracingName: 'update password',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { currentPassword, newPassword, userId } = body;

      const session = CookieService.getSessionCookieByUserId(userId);
      if (!session) throw new Error('Session not found');

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
