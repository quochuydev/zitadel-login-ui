'use client';

import { toast } from 'sonner';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { ROUTING } from '#/lib/router';
import ApiService from '#/services/api.service';
import type {
  APIChangeEmail,
  APIChangePhone,
  APIUpdateProfile,
} from '#/types/api';
import type { Session } from '#/types/zitadel';
import CheckCircleIcon from '@heroicons/react/outline/CheckCircleIcon';
import ExclamationCircleIcon from '@heroicons/react/outline/ExclamationCircleIcon';
import KeyIcon from '@heroicons/react/outline/KeyIcon';
import MailIcon from '@heroicons/react/outline/MailIcon';
import PhoneIcon from '@heroicons/react/outline/PhoneIcon';
import UserIcon from '@heroicons/react/outline/UserIcon';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import AccountShell from '#/ui/Account/AccountShell';

type Profile = {
  userId: string;
  orgId: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
};

const VerifiedBadge = ({ verified }: { verified: boolean }) =>
  verified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
      <CheckCircleIcon className="h-3.5 w-3.5" />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
      <ExclamationCircleIcon className="h-3.5 w-3.5" />
      Not verified
    </span>
  );

export default function Security(props: {
  appUrl: string;
  index: number;
  session: Session;
  sessions: Session[];
  profile: Profile;
}) {
  const { appUrl, index, session, sessions, profile } = props;
  const router = useRouter();
  const apiService = ApiService({ appUrl });

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [username, setUsername] = useState(profile.username);
  const [editProfile, setEditProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    try {
      await apiService.request<APIUpdateProfile>({
        url: '/api/users/profile',
        method: 'post',
        data: {
          orgId: profile.orgId,
          userId: profile.userId,
          firstName,
          lastName,
          username,
        },
      });

      toast.success('Profile updated');
      setEditProfile(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    setEmailLoading(true);
    try {
      await apiService.request<APIChangeEmail>({
        url: '/api/users/email',
        method: 'post',
        data: {
          orgId: profile.orgId,
          userId: profile.userId,
          email,
        },
      });

      toast.success('A verification code has been sent to your new email');
      setEditEmail(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSavePhone = async () => {
    setPhoneLoading(true);
    try {
      await apiService.request<APIChangePhone>({
        url: '/api/users/phone',
        method: 'post',
        data: {
          orgId: profile.orgId,
          userId: profile.userId,
          phone,
        },
      });

      toast.success('A verification code has been sent to your new phone');
      setEditPhone(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update phone number');
    } finally {
      setPhoneLoading(false);
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
      <div>
        <h2 className="text-[24px] font-semibold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500">
          Manage your personal information and sign-in details.
        </p>
      </div>

      {/* Profile info */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <h3 className="flex items-center gap-2 text-[16px] font-medium text-gray-900">
            <UserIcon className="h-5 w-5 text-gray-400" />
            Personal info
          </h3>
          {!editProfile && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => setEditProfile(true)}
            >
              Edit
            </Button>
          )}
        </div>

        {!editProfile ? (
          <dl className="mt-2 divide-y divide-gray-100">
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-gray-500">First name</dt>
              <dd className="text-sm font-medium text-gray-900">
                {profile.firstName || '—'}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-gray-500">Last name</dt>
              <dd className="text-sm font-medium text-gray-900">
                {profile.lastName || '—'}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-gray-500">Username</dt>
              <dd className="text-sm font-medium text-gray-900">
                {profile.username || '—'}
              </dd>
            </div>
          </dl>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                First name
              </label>
              <Input
                value={firstName}
                autoFocus
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                Last name
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={
                  profileLoading || !firstName || !lastName || !username
                }
                onClick={handleSaveProfile}
              >
                {profileLoading ? 'Saving…' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFirstName(profile.firstName);
                  setLastName(profile.lastName);
                  setUsername(profile.username);
                  setEditProfile(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Email */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <h3 className="flex items-center gap-2 text-[16px] font-medium text-gray-900">
            <MailIcon className="h-5 w-5 text-gray-400" />
            Email
          </h3>
          {!editEmail && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => setEditEmail(true)}
            >
              Change
            </Button>
          )}
        </div>

        {!editEmail ? (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-gray-900">
              {profile.email || '—'}
            </span>
            {profile.email && (
              <VerifiedBadge verified={profile.emailVerified} />
            )}
          </div>
        ) : (
          <div className="mt-4">
            <Input
              type="email"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="block w-full appearance-none rounded-[8px] border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                disabled={emailLoading || !email}
                onClick={handleSaveEmail}
              >
                {emailLoading ? 'Saving…' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmail(profile.email);
                  setEditEmail(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Phone */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <h3 className="flex items-center gap-2 text-[16px] font-medium text-gray-900">
            <PhoneIcon className="h-5 w-5 text-gray-400" />
            Phone number
          </h3>
          {!editPhone && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => setEditPhone(true)}
            >
              Change
            </Button>
          )}
        </div>

        {!editPhone ? (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-gray-900">
              {profile.phone || 'No phone number added'}
            </span>
            {profile.phone && (
              <VerifiedBadge verified={profile.phoneVerified} />
            )}
          </div>
        ) : (
          <div className="mt-4">
            <Input
              type="tel"
              value={phone}
              autoFocus
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="block w-full appearance-none rounded-[8px] border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                disabled={phoneLoading || !phone}
                onClick={handleSavePhone}
              >
                {phoneLoading ? 'Saving…' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPhone(profile.phone);
                  setEditPhone(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Password & passkeys */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-[16px] font-medium text-gray-900">
          <KeyIcon className="h-5 w-5 text-gray-400" />
          Password &amp; sign-in
        </h3>

        <button
          type="button"
          onClick={() => router.push(`${ROUTING.ACCOUNT}/${index}/password`)}
          className="flex w-full items-center justify-between border-t border-gray-100 py-3 text-left first:border-t-0 hover:bg-gray-50"
        >
          <span className="text-sm text-gray-900">Change password</span>
          <span className="text-sm text-gray-400">›</span>
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(`${ROUTING.ACCOUNT}/${index}/security/passkeys`)
          }
          className="flex w-full items-center justify-between border-t border-gray-100 py-3 text-left hover:bg-gray-50"
        >
          <span className="flex flex-col">
            <span className="text-sm text-gray-900">Set up passkeys</span>
            <span className="text-xs text-gray-500">
              Sign in without a password using your device
            </span>
          </span>
          <span className="text-sm text-gray-400">›</span>
        </button>
      </section>
    </AccountShell>
  );
}
