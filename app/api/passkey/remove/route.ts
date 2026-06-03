import type { NextRequest } from 'next/server';
import AuthService from '#/services/auth.service';
import type { APIRemovePasskey } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/lib/api-handler';
import * as z from 'zod';

const schema = z.object({
  passkeyId: z.string().trim(),
  userId: z.string().trim(),
  orgId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIRemovePasskey>(
    {
      request,
      tracingName: 'remove passkey',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { userId, orgId, passkeyId } = body;

      const accessToken = await AuthService.getAdminAccessToken();
      const userService = AuthService.createUserService(accessToken);

      await userService.removePasskey({
        userId,
        orgId,
        passkeyId,
      });
    },
  );
}
