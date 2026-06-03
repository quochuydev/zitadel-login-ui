'use client';

import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';
import { coerceToArrayBuffer, coerceToBase64Url } from '#/lib/bytes';
import ApiService from '#/services/api.service';
import type { APIRemovePasskey, APIVerifyPasskey } from '#/types/api';
import type { Session } from '#/types/zitadel';
import AccountShell from '#/ui/Account/AccountShell';
import KeyIcon from '@heroicons/react/outline/KeyIcon';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import { toast } from 'sonner';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Passkey = {
  id: string;
  name: string;
  state: string;
};

export default function PasskeysManager(props: {
  appUrl: string;
  index: number;
  session: Session;
  sessions: Session[];
  orgId: string;
  userId: string;
  passkeyId?: string;
  publicKeyCredentialCreationOptions?: any;
  passkeys: Passkey[];
}) {
  const {
    appUrl,
    index,
    session,
    sessions,
    orgId,
    userId,
    passkeyId,
    publicKeyCredentialCreationOptions,
    passkeys,
  } = props;
  const apiService = ApiService({ appUrl });
  const router = useRouter();
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const addPasskey = async () => {
    if (!passkeyId || !publicKeyCredentialCreationOptions) {
      toast.error(t('security:PASSKEY_START_FAILED'));
      return;
    }

    setAdding(true);
    try {
      publicKeyCredentialCreationOptions.publicKey.challenge =
        coerceToArrayBuffer(
          publicKeyCredentialCreationOptions.publicKey.challenge,
        );
      publicKeyCredentialCreationOptions.publicKey.user.id =
        coerceToArrayBuffer(
          publicKeyCredentialCreationOptions.publicKey.user.id,
        );

      if (publicKeyCredentialCreationOptions.publicKey.excludeCredentials) {
        publicKeyCredentialCreationOptions.publicKey.excludeCredentials.map(
          (cred: any) => {
            cred.id = coerceToArrayBuffer(cred.id as string);
            return cred;
          },
        );
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions.publicKey,
      });

      if (!credential) throw new Error('invalid credential');

      const data = {
        id: credential.id,
        type: credential.type,
        rawId: coerceToBase64Url((credential as any).rawId),
        response: {
          attestationObject: coerceToBase64Url(
            (credential as any).response.attestationObject,
          ),
          clientDataJSON: coerceToBase64Url(
            (credential as any).response.clientDataJSON,
          ),
        },
      };

      await apiService.request<APIVerifyPasskey>({
        url: '/api/passkey/verify',
        method: 'post',
        data: {
          orgId,
          userId,
          passkeyId,
          credential: data,
        },
      });

      toast.success(t('security:PASSKEY_ADDED'));
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.log('debug', error);
      toast.error(t('security:PASSKEY_ADD_FAILED'));
    } finally {
      setAdding(false);
    }
  };

  const removePasskey = async (id: string) => {
    setRemovingId(id);
    try {
      await apiService.request<APIRemovePasskey>({
        url: '/api/passkey/remove',
        method: 'post',
        data: {
          orgId,
          userId,
          passkeyId: id,
        },
      });

      toast.success(t('security:PASSKEY_REMOVED'));
      router.refresh();
    } catch (error) {
      toast.error(t('security:PASSKEY_REMOVE_FAILED'));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <AccountShell
      appUrl={appUrl}
      index={index}
      session={session}
      sessions={sessions}
      active="security"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[24px] font-semibold text-gray-900">
            {t('security:PASSKEYS')}
          </h2>
          <p className="text-sm text-gray-500">{t('security:PASSKEYS_SUBTITLE')}</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">{t('security:ADD_PASSKEY')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('security:ADD_PASSKEY_TITLE')}</DialogTitle>
              <DialogDescription>
                {t('security:ADD_PASSKEY_DESCRIPTION')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={adding}
              >
                {t('CANCEL')}
              </Button>
              <Button onClick={addPasskey} disabled={adding}>
                {adding ? t('security:WAITING_FOR_DEVICE') : t('CONTINUE')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-2">
        {passkeys.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <KeyIcon className="h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">{t('security:NO_PASSKEYS')}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {passkeys.map((passkey) => (
              <li
                key={passkey.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <KeyIcon className="h-5 w-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-gray-900">
                    {passkey.name || 'Passkey'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {passkey.state === 'MFA_STATE_READY'
                      ? t('security:READY')
                      : t('security:PENDING')}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t('security:REMOVE_PASSKEY')}
                  disabled={removingId === passkey.id}
                  onClick={() => removePasskey(passkey.id)}
                >
                  <TrashIcon className="h-5 w-5 text-gray-400" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AccountShell>
  );
}
