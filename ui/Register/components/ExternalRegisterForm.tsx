'use client';
import { loginUsernamePattern, usernameMaxLength } from '#/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { object, string } from 'zod';

export type ExternalRegisterParams = {
  username: string;
  email: string;
  familyName: string;
  givenName: string;
};

type ExternalRegisterFormProps = {
  defaultValues: ExternalRegisterParams;
  loading: boolean;
  handleRegisterForm: (params: ExternalRegisterParams) => Promise<void>;
};

const ExternalRegisterForm: React.FC<ExternalRegisterFormProps> = (props) => {
  const { defaultValues, handleRegisterForm, loading } = props;
  const { t } = useTranslation('common');

  const schema = object({
    username: string()
      .trim()
      .min(1, { message: t('REQUIRED') }),
    email: string()
      .trim()
      .email()
      .min(1, { message: t('REQUIRED') }),
    givenName: string()
      .trim()
      .min(1, { message: t('REQUIRED') }),
    familyName: string()
      .trim()
      .min(1, { message: t('REQUIRED') }),
  }).refine(
    ({ username }) =>
      username.length < usernameMaxLength &&
      loginUsernamePattern.test(username),
    {
      message: t('USERNAME_INVALID'),
      path: ['username'],
    },
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
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

export default ExternalRegisterForm;
