import type { NextRequest } from 'next/server';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type { APILogin } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/helpers/api-handler';
import * as z from 'zod';

const schema = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
  authRequestId: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APILogin>(
    {
      request,
      tracingName: 'login',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { username: loginName, password, authRequestId } = body;

      const accessToken = await AuthService.getAdminAccessToken();

      const sessionService = await AuthService.createSessionService(
        accessToken,
      );

      const newSession = await sessionService.createSession({
        checks: {
          user: {
            loginName,
          },
          password: {
            password,
          },
        },
      });

      const session = await sessionService.getSession({
        sessionId: newSession.sessionId,
      });

      if (!session?.factors?.user) {
        throw new Error('Invalid session');
      }

      const userId = session.factors.user.id;

      CookieService.addSessionToCookie({
        sessionId: newSession.sessionId,
        sessionToken: newSession.sessionToken,
        userId,
      });

      const changeRequired = await checkUserRequireChangePassword({
        accessToken,
        orgId: session.factors.user.organisationId,
        userId: session.factors.user.id,
      });

      const result: APILogin['result'] = {
        changeRequired,
        userId,
      };

      // If user need to change password (changeRequired === true)
      // => go to /password first
      if (!changeRequired && authRequestId) {
        const oidcService = await AuthService.createOIDCService(accessToken);

        const callbackResult = await oidcService.createCallback({
          authRequestId,
          session: {
            sessionId: newSession.sessionId,
            sessionToken: newSession.sessionToken,
          },
        });

        result.callbackUrl = callbackResult.callbackUrl;
      }

      return result;
    },
  );
}

/**
 * 2023/10/14
 * In this version - Zitadel v2.37.1
 * Zitadel have not supported attributes `changeRequired` to check user NEED TO update password
 * Github issue: https://github.com/zitadel/zitadel/issues/6614
 * Github feature ticket: https://github.com/zitadel/zitadel/issues/6434
 * So we need to check by other way that check user's events
 * Need to update it future
 */
async function checkUserRequireChangePassword(params: {
  accessToken: string;
  userId: string;
  orgId: string;
}): Promise<boolean> {
  try {
    const { accessToken, orgId, userId } = params;

    const userService = await AuthService.createAdminService(accessToken);

    const events = await userService.searchEvents({
      resourceOwner: orgId,
      aggregateId: userId,
      aggregateTypes: ['user'],
      eventTypes: ['user.human.added', 'user.human.password.changed'],
    });

    const userCreatedEvent = events.find(
      (e) => e.type?.type === 'user.human.added',
    );

    const changeRequired = !!userCreatedEvent?.payload?.['changeRequired'];

    if (changeRequired) {
      const passwordEvent = events.find(
        (e) =>
          e.type?.type === 'user.human.password.changed' &&
          e.editor?.userId === userId,
      );

      return !passwordEvent;
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
