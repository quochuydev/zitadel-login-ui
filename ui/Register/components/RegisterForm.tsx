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
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { object, string } from 'zod';
import { RegisterParams } from '../Register';

type RegisterFormForm = {
  loading: boolean;
  handleRegisterForm: (params: RegisterParams) => Promise<void>;
};

const RegisterFormForm: React.FC<RegisterFormForm> = (props) => {
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
      .email()
      .min(1, { message: t('REQUIRED') }),
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
    )
    .refine((data) => calculateByteSize(data.password) <= maxByteSize, {
      message: t('ERROR_PASSWORD_LIMIT_SIZE', { maxByteSize }),
      path: ['password'],
    });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(handleRegisterForm)}>
      <input
        required
        className="appearance-none rounded-[8px] w-full px-3 py-2 mb-[24px] border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder="Username"
        disabled={loading}
        {...register('username')}
        onChange={(e) => {
          setValue('username', e.target.value?.replace(/\s/g, ''));
        }}
      />

      <input
        required
        className="appearance-none rounded-[8px] w-full px-3 py-2 mb-[24px] border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder="Email"
        disabled={loading}
        {...register('email')}
      />

      <input
        autoFocus
        required
        className="appearance-none rounded-[8px] w-full px-3 py-2 mb-[24px] border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder="Given name"
        disabled={loading}
        {...register('givenName')}
      />

      <input
        required
        className="appearance-none rounded-[8px] w-full px-3 py-2 mb-[24px] border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder="Family name"
        disabled={loading}
        {...register('familyName')}
      />

      <div className="relative">
        <input
          id="password"
          type={hidePwd ? 'password' : 'text'}
          required
          className="appearance-none mb-[24px] rounded-[8px] relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Password"
          disabled={loading}
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

      <div className="relative">
        <input
          required
          className="appearance-none mb-[24px] rounded-[8px] relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          id="confirmPassword"
          placeholder="Password confirmation"
          type={hideConfirmPwd ? 'password' : 'text'}
          disabled={loading}
          {...register('confirmPassword')}
        />

        <Image
          src={`/images/${hideConfirmPwd ? 'eye' : 'eye-off'}.png`}
          onClick={() => setHideConfirmPwd(!hideConfirmPwd)}
          alt="logo"
          width={20}
          height={20}
          className="absolute right-4 z-10 top-2 hover:cursor-pointer"
        />
      </div>

      <button
        className="disabled:bg-gray-300 group relative w-full flex justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        type="submit"
        disabled={isSubmitting || loading || !isValid}
      >
        {loading ? 'Loading...' : 'Log in'}
      </button>
    </form>
  );
};

export default RegisterFormForm;
