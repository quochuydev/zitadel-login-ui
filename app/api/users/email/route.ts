import type { NextRequest } from 'next/server';
import AuthService from '#/services/auth.service';
import type { APIChangeEmail } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/lib/api-handler';
import * as z from 'zod';

const schema = z.object({
  email: z.string().trim().email(),
  userId: z.string().trim(),
  orgId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIChangeEmail>(
    {
      request,
      tracingName: 'change email',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { userId, orgId, email } = body;

      const accessToken = await AuthService.getAdminAccessToken();
      const userService = AuthService.createUserService(accessToken);

      await userService.setEmail({
        userId,
        orgId,
        email,
      });
    },
  );
}
