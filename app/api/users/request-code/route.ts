import { defaultHandler, isValidRequest } from '#/helpers/api-handler';
import AuthService, { zitadelService } from '#/services/backend/auth.service';
import type { APIRequestCode } from '#/types/api';
import type { GetUserByLoginName } from '#/types/zitadel';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  username: z.string().trim(),
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

      const { username } = body;

      const accessToken = await AuthService.getAdminAccessToken();

      const user = await zitadelService
        .request<GetUserByLoginName>({
          url: '/management/v1/global/users/_by_login_name',
          query: {
            loginName: username,
          },
          method: 'get',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((e) => e.user);

      const result = await zitadelService.request<any>({
        url: '/v2beta/users/{userId}/password_reset',
        params: {
          userId: user.id,
        },
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-zitadel-orgid': user.details.resourceOwner,
        },
        data: {
          returnCode: {},
        },
      });

      console.log('debug', result);

      return {
        code: result.verificationCode,
        orgId: user.details.resourceOwner,
        userId: user.id,
      };
    },
  );
}
