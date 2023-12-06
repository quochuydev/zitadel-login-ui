import configuration from '#/configuration';
import { defaultHandler, isValidRequest } from '#/helpers/api-handler';
import AuthService from '#/services/backend/auth.service';
import ZitadelService from '#/services/backend/zitadel.service';
import type { APIRegister } from '#/types/api';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const zitadelService = ZitadelService({
  host: configuration.zitadel.url,
});

const schema = z.object({
  // username: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIRegister>(
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

      const { userId } = body;

      const accessToken = await AuthService.getAdminAccessToken();

      await zitadelService
        .request<any>({
          url: '/v2beta/users/{userId}/password_reset',
          params: {
            userId
          },
          method: 'post',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'x-zitadel-orgid': '243843074894125785'
          },
          data:{
            returnCode: {}
          }
        })

      const result: APIRegister['result'] = {
        userId,
      };

      return result;
    },
  );
}
