import { defaultHandler, isValidRequest } from '#/lib/api-handler';
import AuthService, { zitadelService } from '#/services/backend/auth.service';
import type { APIRequestCode } from '#/types/api';
import type { GetUserByLoginName } from '#/types/zitadel';
import type { NextRequest } from 'next/server';
import * as z from 'zod';
import { Resend } from 'resend';
import configuration from '#/configuration';

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

      if (!user.human.email.isEmailVerified) {
        throw new Error('user mail is not verified');
      }

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

      if (configuration.resend.apiKey) {
        const resend = new Resend(configuration.resend.apiKey);

        resend.emails.send({
          from: 'onboarding@resend.dev',
          to: 'quochuydev1@gmail.com',
          subject: '[zitadel] change password',
          html: `<p>
  <strong>change password url:</strong>
  ${`${configuration.appUrl}/password/init?userID=${result.userId}&code=${result.code}&orgID=${result.orgId}`}
</p>`,
        });
      }
    },
  );
}
