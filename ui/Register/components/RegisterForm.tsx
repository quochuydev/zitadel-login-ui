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
import { RegisterParams } from '../Register';

type RegisterFormProps = {
  loading: boolean;
  handleRegisterForm: (params: RegisterParams) => Promise<void>;
};

const inputClass =
  'appearance-none block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100';

const inputErrorClass =
  'appearance-none block w-full rounded-md border border-red-500 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:bg-gray-100';

const RegisterForm: React.FC<RegisterFormProps> = (props) => {
  const { handleRegisterForm, loading } = props;
  const [hidePwd, setHidePwd] = useState<boolean>(true);
  const [hideConfirmPwd, setHideConfirmPwd] = useState<boolean>(true);
  const { t } = useTranslation('common');

  const schema = object({
    username: string()
      .trim()
      .min(1, { message: t('REQUIRED') }),
    email: string()
      .trim()
      .min(1, { message: t('REQUIRED') })
      .email({ message: t('EMAIL_INVALID') }),
    password: string()
      .trim()
      .min(1, { message: t('REQUIRED') }),
    confirmPassword: string()
      .trim()
      .min(1, { message: t('REQUIRED') }),
    givenName: string()
      .trim()
      .min(1, { message: t('REQUIRED') }),
    familyName: string()
      .trim()
      .min(1, { message: t('REQUIRED') }),
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
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('PASSWORD_CONFIRM_MISMATCH'),
      path: ['confirmPassword'],
    });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof schema>>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(handleRegisterForm)} noValidate>
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
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="username"
            required
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            className={errors.username ? inputErrorClass : inputClass}
            placeholder={t('USERNAME_PLACEHOLDER')}
            disabled={loading}
            {...register('username')}
            onChange={(e) => {
              setValue('username', e.target.value?.replace(/\s/g, ''));
            }}
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
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {t('EMAIL')}
          </label>
          <input
            id="email"
            type="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={errors.email ? inputErrorClass : inputClass}
            placeholder={t('EMAIL_PLACEHOLDER')}
            disabled={loading}
            {...register('email')}
          />
          {errors.email?.message && (
            <p
              id="email-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="givenName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t('GIVEN_NAME')}
            </label>
            <input
              id="givenName"
              type="text"
              autoComplete="given-name"
              autoFocus
              required
              aria-invalid={!!errors.givenName}
              aria-describedby={
                errors.givenName ? 'givenName-error' : undefined
              }
              className={errors.givenName ? inputErrorClass : inputClass}
              placeholder={t('GIVEN_NAME_PLACEHOLDER')}
              disabled={loading}
              {...register('givenName')}
            />
            {errors.givenName?.message && (
              <p
                id="givenName-error"
                role="alert"
                className="mt-1 text-xs text-red-600"
              >
                {errors.givenName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="familyName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t('FAMILY_NAME')}
            </label>
            <input
              id="familyName"
              type="text"
              autoComplete="family-name"
              required
              aria-invalid={!!errors.familyName}
              aria-describedby={
                errors.familyName ? 'familyName-error' : undefined
              }
              className={errors.familyName ? inputErrorClass : inputClass}
              placeholder={t('FAMILY_NAME_PLACEHOLDER')}
              disabled={loading}
              {...register('familyName')}
            />
            {errors.familyName?.message && (
              <p
                id="familyName-error"
                role="alert"
                className="mt-1 text-xs text-red-600"
              >
                {errors.familyName.message}
              </p>
            )}
          </div>
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
              autoComplete="new-password"
              required
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`${errors.password ? inputErrorClass : inputClass} pr-12`}
              placeholder={t('PASSWORD_PLACEHOLDER')}
              disabled={loading}
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {t('CONFIRM_PASSWORD')}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={hideConfirmPwd ? 'password' : 'text'}
              autoComplete="new-password"
              required
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? 'confirmPassword-error' : undefined
              }
              className={`${errors.confirmPassword ? inputErrorClass : inputClass} pr-12`}
              placeholder={t('CONFIRM_PASSWORD_PLACEHOLDER')}
              disabled={loading}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setHideConfirmPwd(!hideConfirmPwd)}
              aria-label={
                hideConfirmPwd ? t('SHOW_PASSWORD') : t('HIDE_PASSWORD')
              }
              aria-pressed={!hideConfirmPwd}
              className="absolute inset-y-0 right-0 flex h-11 w-11 items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none rounded-r-md"
            >
              {hideConfirmPwd ? (
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
          {errors.confirmPassword?.message && (
            <p
              id="confirmPassword-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        className="mt-6 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        type="submit"
        disabled={isSubmitting || loading}
      >
        {loading || isSubmitting ? t('LOADING') : t('REGISTER')}
      </button>
    </form>
  );
};

export default RegisterForm;
