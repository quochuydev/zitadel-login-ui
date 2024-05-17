'use client';
import { calculateByteSize } from '#/helpers/bytes';
import {
  loginUsernamePattern,
  lowercasePattern,
  maxByteSize,
  numberPattern,
  passwordMinLength,
  specialPattern,
  uppercasePattern,
  usernameMaxLength,
} from '#/helpers/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
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
    )
    .refine((data) => calculateByteSize(data.password) <= maxByteSize, {
      message: t('ERROR_PASSWORD_LIMIT_SIZE', { maxByteSize }),
      path: ['password'],
    });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: defaultUsername
      ? {
          username: defaultUsername,
        }
      : undefined,
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(handleSignIn)}>
      <div className="rounded-md shadow-sm space-y-px">
        <input
          autoFocus={!defaultUsername}
          required
          className="appearance-none rounded-[8px] relative block w-full px-3 py-2 mb-[24px] border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Username"
          disabled={loading || isSubmitting || !!defaultUsername}
          {...register('username')}
        />

        <div className="relative">
          <input
            autoFocus={!!defaultUsername}
            id="password"
            type={hidePwd ? 'password' : 'text'}
            required
            className="appearance-none mb-[24px] rounded-[8px] relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            disabled={loading || isSubmitting}
            {...register('password')}
          />

          <Image
            src={`/images/${hidePwd ? 'eye' : 'eye-off'}.png`}
            alt="logo"
            width={20}
            height={20}
            onClick={() => setHidePwd(!hidePwd)}
            className="absolute right-4 z-10 top-2 hover:cursor-pointer"
          />
        </div>
      </div>

      <button
        type="submit"
        className="disabled:bg-gray-300 group relative w-full flex justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isSubmitting || loading || !isValid}
      >
        {loading ? 'Loading...' : 'Log in'}
      </button>
    </form>
  );
};

export default SignInForm;
