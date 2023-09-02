'use client';

import { login, finalizeAuthRequest } from '@/services';
import { useEffect } from 'react';

export default function OIDCReturn({ orgId, userId, intentId: idpIntentId, token: idpIntentToken, authRequestId }: any) {
  useEffect(() => {
    login(orgId, {
      checks: {
        user: {
          userId,
        },
        idpIntent: {
          idpIntentId,
          idpIntentToken,
        },
      },
    }).then((session) => {
      if (!session.sessionId) {
        return;
      }

      if (!authRequestId) {
        window.location.href = '/';
        return;
      }

      finalizeAuthRequest({ orgId, authRequestId, session })
        .then((result: any) => {
          if (result.callbackUrl) {
            window.location.href = result.callbackUrl;
          }
        })
        .catch((_) => {
          window.location.href = '/';
        });
    });
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <p>Login success, redirecting to application</p>
        <p>Loading...</p>
      </div>
    </div>
  );
}
