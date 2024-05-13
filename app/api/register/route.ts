import { defaultHandler, isValidRequest } from '#/helpers/api-handler';
import AuthService, {
  FlowType,
  Trigger,
  flows,
  shouldTriggerAction,
  zitadelService,
} from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APIRegister } from '#/types/api';
import type { GetLoginSettings } from '#/types/zitadel';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  orgId: z.string().trim(),
  givenName: z.string().trim(),
  familyName: z.string().trim(),
  email: z.string().trim(),
  password: z.string().trim(),
  projectId: z.string().trim().optional(),
  authRequestId: z.string().trim().optional(),
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

      const { orgId, email, password, familyName, givenName, authRequestId } =
        body;

      const accessToken = await AuthService.getAdminAccessToken();

      const loginSetting = await zitadelService
        .request<GetLoginSettings>({
          url: '/v2beta/settings/login',
          query: {
            orgId,
          },
          method: 'get',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => res.settings);

      if (!loginSetting.allowRegister) throw new Error('Not allow register');

      const userService = await AuthService.createUserService(accessToken);

      const user = await userService.createHumanUser({
        username: email,
        email: {
          email,
          isVerified: true,
        },
        organisation: {
          orgId,
        },
        password: {
          password,
          changeRequired: false,
        },
        profile: {
          displayName: `${givenName} ${familyName}`,
          familyName,
          gender: 'GENDER_UNSPECIFIED',
          givenName,
        },
      });

      const userId = user.userId;

      for (const flow of flows) {
        if (
          shouldTriggerAction({
            flow,
            orgId,
            flowType: FlowType.internalAuthentication,
            trigger: Trigger.postCreation,
          })
        ) {
          await flow.action({
            user: {
              userId,
              orgId,
            },
            accessToken,
          });
        }
      }

      const sessionService = AuthService.createSessionService(accessToken);

      const session = await sessionService.createSession({
        checks: {
          user: {
            loginName: email,
          },
          password: {
            password,
          },
        },
      });

      CookieService.addSessionToCookie({
        sessionId: session.sessionId,
        sessionToken: session.sessionToken,
        userId,
      });

      const result: APIRegister['result'] = {
        userId,
      };

      if (authRequestId) {
        const oidcService = AuthService.createOIDCService(accessToken);

        const callbackResult = await oidcService.createCallback({
          authRequestId,
          session: {
            sessionId: session.sessionId,
            sessionToken: session.sessionToken,
          },
        });

        result.callbackUrl = callbackResult.callbackUrl;
      }

      return result;
    },
  );
}
