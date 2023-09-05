'use client';

import { useEffect } from 'react';
import { login, finalizeAuthRequest } from '@/lib/api';

export default function OidcReturn(props: {
  orgId: string;
  userId: string;
  idpIntentId: string;
  idpIntentToken: string;
  authRequestId: string;
}) {
  const { orgId, userId, idpIntentId, idpIntentToken, authRequestId } = props;

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
  }, [orgId, userId, idpIntentId, idpIntentToken, authRequestId]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <p>Login success, redirecting to application</p>
        <p>Loading...</p>
      </div>
    </div>
  );
}
