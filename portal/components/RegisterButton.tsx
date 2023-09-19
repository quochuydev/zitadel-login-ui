'use client';

import { finalizeAuthRequest, register } from '@/api';
import { AddHumanUserRequest } from '@/zitadel-server/proto/zitadel/user/v2beta/user_service';

export default function RegisterButton(props: {
  orgId: string;
  authRequestId: string;
  userData: Partial<AddHumanUserRequest>;
}) {
  const { orgId, authRequestId, userData } = props;

  return (
    <button
      onClick={async () => {
        const session = await register(orgId, userData);

        const result = await finalizeAuthRequest(orgId, {
          authRequestId,
          session,
        });

        if (result.callbackUrl) {
          window.location.href = result.callbackUrl;
        }
      }}
    >
      Register
    </button>
  );
}
