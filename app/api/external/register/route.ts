import { defaultHandler, isValidRequest } from '#/lib/api-handler';
import AuthService, { zitadelService } from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APIExternalRegister } from '#/types/api';
import type { CreateHumanUser, GetLoginSettings } from '#/types/zitadel';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  username: z.string().trim(),
  email: z.string().trim(),
  givenName: z.string().trim(),
  familyName: z.string().trim(),
  idpIntentId: z.string().trim(),
  idpIntentToken: z.string().trim(),
  idpLink: z.object({
    idpId: z.string().trim(),
    userId: z.string().trim(),
    userName: z.string().trim(),
  }),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIExternalRegister>(
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

      const {
        username,
        email,
        familyName,
        givenName,
        idpIntentId,
        idpIntentToken,
        idpLink,
      } = body;

      const accessToken = await AuthService.getAdminAccessToken();

      const loginSetting = await zitadelService
        .request<GetLoginSettings>({
          url: '/v2beta/settings/login',
          method: 'get',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => res.settings);

      if (!loginSetting.allowRegister) throw new Error('Not allow register');

      const userService = await AuthService.createUserService(accessToken);

      const userData: CreateHumanUser['data'] = {
        username,
        email: {
          email,
          isVerified: true,
        },
        profile: {
          displayName: [givenName, familyName].join(' '),
          familyName,
          gender: 'GENDER_UNSPECIFIED',
          givenName,
        },
        idpLinks: [idpLink],
      };

      const user = await userService.createHumanUser({
        data: userData,
      });

      const userId = user.userId;

      const sessionService = AuthService.createSessionService(accessToken);

      const session = await sessionService.createSession({
        checks: {
          user: {
            userId,
          },
          idpIntent: {
            idpIntentId,
            idpIntentToken,
          },
        },
      });

      CookieService.addSessionToCookie({
        sessionId: session.sessionId,
        sessionToken: session.sessionToken,
        userId,
      });

      const result: APIExternalRegister['result'] = {
        userId,
      };

      return result;
    },
  );
}
