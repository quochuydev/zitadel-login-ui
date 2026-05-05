'use client';
import { calculateByteSize } from '#/lib/bytes';
import {
  loginUsernamePattern,
  lowercasePattern,
  maxByteSize,
  numberPattern,
  passwordMinLength,
  specialPattern,
  uppercasePattern,
  usernameMaxLength,
} from '#/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { object, string } from 'zod';

type SignInForm = {
  loading?: boolean;
  defaultUsername?: string;
  handleSignIn: (params: {
    username: string;
    password: string;
  }) => Promise<void>;
};

const inputClass =
  'appearance-none block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100';

const inputErrorClass =
  'appearance-none block w-full rounded-md border border-red-500 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:bg-gray-100';

const SignInForm: React.FC<SignInForm> = (props) => {
  const { defaultUsername, handleSignIn, loading } = props;
  const [hidePwd, setHidePwd] = useState<boolean>(true);
  const { t } = useTranslation('common');

  const schema = object({
    username: string()
      .trim()
      .min(1, {
        message: t('REQUIRED'),
      }),
    password: string()
      .trim()
      .min(1, {
        message: t('REQUIRED'),
      }),
  })
    .refine(
      ({ username }) =>
        username.length < usernameMaxLength &&
        loginUsernamePattern.test(username),
      {
        message: t('USERNAME_INVALID'),
        path: ['username'],
      },
    )
    .refine(
      ({ password }) =>
        password.length >= passwordMinLength &&
        uppercasePattern.test(password) &&
        lowercasePattern.test(password) &&
        numberPattern.test(password) &&
        specialPattern.test(password),
      {
        message: t('PASSWORD_COMPLEXITY'),
        path: ['password'],
      },
    )
    .refine((data) => calculateByteSize(data.password) <= maxByteSize, {
      message: t('ERROR_PASSWORD_LIMIT_SIZE', { maxByteSize }),
      path: ['password'],
    });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof schema>>({
    mode: 'onBlur',
    defaultValues: defaultUsername
      ? {
          username: defaultUsername,
        }
      : undefined,
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(handleSignIn)} noValidate>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {t('USERNAME')}
          </label>
          <input
            id="username"
            type="text"
            autoFocus={!defaultUsername}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="username"
            inputMode="email"
            required
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            className={errors.username ? inputErrorClass : inputClass}
            placeholder={t('USERNAME_PLACEHOLDER')}
            disabled={loading || isSubmitting || !!defaultUsername}
            {...register('username')}
          />
          {errors.username?.message && (
            <p
              id="username-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {t('PASSWORD')}
          </label>
          <div className="relative">
            <input
              id="password"
              type={hidePwd ? 'password' : 'text'}
              autoComplete="current-password"
              required
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`${errors.password ? inputErrorClass : inputClass} pr-12`}
              placeholder={t('PASSWORD_PLACEHOLDER')}
              disabled={loading || isSubmitting}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setHidePwd(!hidePwd)}
              aria-label={hidePwd ? t('SHOW_PASSWORD') : t('HIDE_PASSWORD')}
              aria-pressed={!hidePwd}
              className="absolute inset-y-0 right-0 flex h-11 w-11 items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none rounded-r-md"
            >
              {hidePwd ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
          {errors.password?.message && (
            <p
              id="password-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={isSubmitting || loading}
      >
        {loading || isSubmitting ? t('LOADING') : t('LOG_IN')}
      </button>
    </form>
  );
};

export default SignInForm;
