'use client';

import { appUrl } from '@/config';
import { finalizeAuthRequest, register } from '@/services';

export default function RegisterButton(props: { orgId: string; authRequestId: string; userData: any }) {
  const { orgId, authRequestId, userData } = props;

  return (
    <button
      onClick={async () => {
        const session = await register(orgId, userData);

        const result = await finalizeAuthRequest({
          orgId,
          authRequestId,
          session,
        });

        console.log('result', result, result.callbackUrl);

        if (result.callbackUrl) {
          window.location.href = result.callbackUrl;
        }
      }}
    >
      Register
    </button>
  );
}
