import { defaultHandler, isValidRequest } from '#/lib/api-handler';
import AuthService from '#/services/backend/auth.service';
import type { APIExternalLinkIDP } from '#/types/api';
import type { NextRequest } from 'next/server';
import * as z from 'zod';

const schema = z.object({
  userId: z.string().trim(),
  idpLink: z.object({
    idpId: z.string().trim(),
    userId: z.string().trim(),
    userName: z.string().trim(),
  }),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIExternalLinkIDP>(
    {
      request,
      tracingName: 'link idp',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const accessToken = await AuthService.getAdminAccessToken();
      const userService = AuthService.createUserService(accessToken);

      const { userId, idpLink } = body;

      await userService.addIDPLink(userId, {
        idpLink,
      });
    },
  );
}
