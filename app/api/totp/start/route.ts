import { defaultHandler, isValidRequest } from '#/lib/api-handler';
import AuthService, { zitadelService } from '#/services/backend/auth.service';
import type { APIStartTOTP } from '#/types/api';
import { RegisterTOTP } from '#/types/zitadel';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  orgId: z.string().trim(),
  userId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIStartTOTP>(
    {
      request,
      tracingName: 'startTOTP',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { orgId, userId } = body;

      const accessToken = await AuthService.getAdminAccessToken();

      const result = await zitadelService.request<RegisterTOTP>({
        url: '/v2beta/users/{userId}/totp',
        params: {
          userId,
        },
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-zitadel-orgid': `${orgId}`,
        },
        data: {},
      });

      return {
        secret: result.secret,
        uri: result.uri,
      };
    },
  );
}
