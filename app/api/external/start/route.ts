import configuration from '#/configuration';
import { objectToQueryString } from '#/helpers/api-caller';
import { defaultHandler, isValidRequest } from '#/helpers/api-handler';
import AuthService from '#/services/backend/auth.service';
import type { APIStartExternal } from '#/types/api';
import type { NextRequest } from 'next/server';
import * as z from 'zod';
import { ROUTING } from '#/helpers/router';

const schema = z.object({
  idpId: z.string().trim(),
  orgId: z.string().trim().optional(),
  authRequestId: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIStartExternal>(
    {
      request,
      tracingName: 'start login external',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { orgId, idpId, authRequestId } = body;

      const accessToken = await AuthService.getAdminAccessToken();
      const userService = AuthService.createUserService(accessToken);

      const successUrl = objectToQueryString(
        new URL(
          ROUTING.LOGIN_EXTERNAL_IDP_SUCCESS,
          configuration.appUrl,
        ).toString(),
        {
          authRequest: authRequestId,
        },
      );

      const failureUrl = objectToQueryString(
        new URL(
          ROUTING.LOGIN_EXTERNAL_IDP_FAIL,
          configuration.appUrl,
        ).toString(),
        {
          authRequest: authRequestId,
        },
      );

      const idpIntent = await userService.startIdentityProviderIntent({
        orgId,
        data: {
          idpId,
          urls: {
            successUrl,
            failureUrl,
          },
        },
      });

      return {
        authUrl: idpIntent.authUrl,
      };
    },
  );
}
