import type { NextRequest } from 'next/server';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APIChangePassword } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/lib/api-handler';
import * as z from 'zod';

const schema = z.object({
  currentPassword: z.string().trim(),
  newPassword: z.string().trim(),
  userId: z.string().trim(),
  orgId: z.string().trim(),
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

      const { userId, orgId, currentPassword, newPassword } = body;

      const accessToken = await AuthService.getAdminAccessToken();
      const userService = AuthService.createUserService(accessToken);

      await userService.changePassword({
        userId,
        orgId,
        currentPassword,
        newPassword,
      });
    },
  );
}
