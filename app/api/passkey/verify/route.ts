import configuration from '#/configuration';
import { defaultHandler, isValidRequest } from '#/helpers/api-handler';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import ZitadelService, {
  GetLoginSettings, VerifyPasskeyRegistration,
} from '#/services/backend/zitadel.service';
import {
  FlowType,
  Trigger,
  flows,
  shouldTriggerAction,
} from '#/services/backend/auth.service';
import type {  } from '#/types/api';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const zitadelService = ZitadelService({
  host: configuration.zitadel.url,
});

const schema = z.object({
  orgId: z.string().trim(),
  userId: z.string().trim(),
  passkeyId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<any>(
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
        orgId,
        userId,
        passkeyId,
        credential
      } = body;

      const accessToken = await AuthService.getAdminAccessToken();

      const result = await zitadelService
        .request<VerifyPasskeyRegistration>({
          url: '/v2beta/users/{userId}/passkeys/{passkeyId}',
          params: {
            userId,
            passkeyId,
          },
          method: 'post',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'x-zitadel-orgid': `${orgId}`
          },
          data:{
            publicKeyCredential: credential,
            passkeyName: 'passkeyName' + new Date().toISOString()
          }
        })

      return  {
        result
      };
    },
  );
}
