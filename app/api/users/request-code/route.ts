import configuration from '#/configuration';
import { defaultHandler, isValidRequest } from '#/helpers/api-handler';
import AuthService from '#/services/backend/auth.service';
import ZitadelService from '#/services/backend/zitadel.service';
import type { APIRequestCode } from '#/types/api';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const zitadelService = ZitadelService({
  host: configuration.zitadel.url,
});

const schema = z.object({
  userId: z.string().trim(),
  orgId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIRequestCode>(
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

      const { userId, orgId } = body;

      const accessToken = await AuthService.getAdminAccessToken();

      const result = await zitadelService.request<any>({
        url: '/v2beta/users/{userId}/password_reset',
        params: {
          userId,
        },
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-zitadel-orgid': orgId,
        },
        data: {
          returnCode: {},
        },
      });

      console.log('debug', result);

      return {
        code: result.verificationCode,
      };
    },
  );
}
