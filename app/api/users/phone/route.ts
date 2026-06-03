import type { NextRequest } from 'next/server';
import AuthService from '#/services/auth.service';
import type { APIChangePhone } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/lib/api-handler';
import * as z from 'zod';

const schema = z.object({
  phone: z.string().trim().min(1),
  userId: z.string().trim(),
  orgId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIChangePhone>(
    {
      request,
      tracingName: 'change phone',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { userId, orgId, phone } = body;

      const accessToken = await AuthService.getAdminAccessToken();
      const userService = AuthService.createUserService(accessToken);

      await userService.setPhone({
        userId,
        orgId,
        phone,
      });
    },
  );
}
