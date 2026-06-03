import type { NextRequest } from 'next/server';
import AuthService from '#/services/auth.service';
import type { APIUpdateProfile } from '#/types/api';
import { isValidRequest, defaultHandler } from '#/lib/api-handler';
import * as z from 'zod';

const schema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  username: z.string().trim().min(1),
  userId: z.string().trim(),
  orgId: z.string().trim(),
});

export async function POST(request: NextRequest) {
  return defaultHandler<APIUpdateProfile>(
    {
      request,
      tracingName: 'update profile',
    },
    async (body) => {
      isValidRequest({
        data: {
          ...body,
        },
        schema,
      });

      const { userId, orgId, firstName, lastName, username } = body;

      const accessToken = await AuthService.getAdminAccessToken();
      const userService = AuthService.createUserService(accessToken);

      await userService.updateProfile({
        userId,
        orgId,
        firstName,
        lastName,
        username,
      });
    },
  );
}
