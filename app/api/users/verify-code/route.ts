import { defaultHandler, isValidRequest } from '#/helpers/api-handler';
import AuthService, { zitadelService } from '#/services/backend/auth.service';
import type { APIVerifyCode } from '#/types/api';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  userId: z.string().trim(),
  orgId: z.string().trim(),
  verificationCode: z.string().trim(),
  password: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIVerifyCode>(
    {
      request,
      tracingName: 'register',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { userId, orgId, verificationCode, password } = body;

      const accessToken = await AuthService.getAdminAccessToken();

      await zitadelService.request<any>({
        url: '/v2beta/users/{userId}/password',
        params: {
          userId,
        },
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-zitadel-orgid': orgId,
        },
        data: {
          newPassword: {
            password,
            changeRequired: false,
          },
          verificationCode,
        },
      });
    },
  );
}
