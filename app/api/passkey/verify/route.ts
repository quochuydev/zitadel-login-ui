import { defaultHandler, isValidRequest } from '#/lib/api-handler';
import AuthService, { zitadelService } from '#/services/backend/auth.service';
import { APIVerifyPasskey } from '#/types/api';
import type { VerifyPasskeyRegistration } from '#/types/zitadel';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  orgId: z.string().trim(),
  userId: z.string().trim(),
  passkeyId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIVerifyPasskey>(
    {
      request,
      tracingName: 'verifyPasskey',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { orgId, userId, passkeyId, credential } = body;
      const accessToken = await AuthService.getAdminAccessToken();

      await zitadelService.request<VerifyPasskeyRegistration>({
        url: '/v2beta/users/{userId}/passkeys/{passkeyId}',
        params: {
          userId,
          passkeyId,
        },
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-zitadel-orgid': `${orgId}`,
        },
        data: {
          publicKeyCredential: credential,
          passkeyName: 'passkeyName ' + new Date().toISOString(),
        },
      });
    },
  );
}
