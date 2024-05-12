'use client';
import Image from 'next/image';
import React, { useState } from 'react';

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
  const [username, setUsername] = useState<string>(defaultUsername || '');
  const [password, setPassword] = useState<string>('');
  const [hidePwd, setHidePwd] = useState<boolean>(true);

  return (
    <div className="my-4 ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn({ username, password });
        }}
      >
        <div className="rounded-md shadow-sm space-y-px">
          {defaultUsername ? (
            <h2 className="mb-[24px]">{defaultUsername}</h2>
          ) : (
            <div>
              <input
                autoFocus
                name="username"
                required
                className="appearance-none rounded-[8px] relative block w-full px-3 py-2 mb-[24px] border border-gray-300 placeholder-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                disabled={loading}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="relative">
            <input
              autoFocus={!!defaultUsername}
              id="password"
              name="password"
              type={hidePwd ? 'password' : 'text'}
              required
              className="appearance-none mb-[24px] rounded-[8px] relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
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
          disabled={!username.trim() || !password.trim() || loading}
        >
          {loading ? 'Loading...' : 'Log in'}
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
