import { defaultHandler, isValidRequest } from '#/lib/api-handler';
import AuthService, { zitadelService } from '#/services/backend/auth.service';
import { APIVerifyTOTP } from '#/types/api';
import type { VerifyTOTPRegistration } from '#/types/zitadel';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  orgId: z.string().trim(),
  userId: z.string().trim(),
  code: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIVerifyTOTP>(
    {
      request,
      tracingName: 'verifyTOTP',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { orgId, userId, code } = body;
      const accessToken = await AuthService.getAdminAccessToken();

      await zitadelService.request<VerifyTOTPRegistration>({
        url: '/v2beta/users/{userId}/totp/verify',
        params: {
          userId,
        },
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-zitadel-orgid': `${orgId}`,
        },
        data: {
          code,
        },
      });
    },
  );
}
