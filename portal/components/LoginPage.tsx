'use client';

import { IdentityProvider, IdentityProviderType } from '@/zitadel-server';
import { finalizeAuthRequest, retrieveIntent, login, startIdpIntent } from '@/lib/api';
import { useState } from 'react';
import { appUrl } from '@/config';

const PROVIDER_MAP = {
  [IdentityProviderType.IDENTITY_PROVIDER_TYPE_GOOGLE.toString()]: 'google',
  [IdentityProviderType.IDENTITY_PROVIDER_TYPE_LDAP.toString()]: 'ldap',
};

export default function LoginPage(props: { orgId: string; authRequestId: string; identityProviders: IdentityProvider[] }) {
  const { orgId, authRequestId, identityProviders } = props;

  const renderIdentityProvider = (identityProvider: IdentityProvider) => {
    if (identityProvider.type === IdentityProviderType.IDENTITY_PROVIDER_TYPE_GOOGLE) {
      return (
        <div key={identityProvider.id} className="my-4">
          <button
            onClick={async () => {
              const provider = PROVIDER_MAP[identityProvider.type];

              const result = await startIdpIntent(orgId, {
                idpId: identityProvider.id,
                urls: {
                  successUrl: `${appUrl}/idp/${provider}/return?authRequest=${authRequestId}`,
                  failureUrl: `${appUrl}/idp/${provider}/return`,
                },
              });

              if (result.authUrl) {
                window.location.href = result.authUrl;
              }
            }}
            type="submit"
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login with google
          </button>
        </div>
      );
    }

    if (identityProvider.type === IdentityProviderType.IDENTITY_PROVIDER_TYPE_LDAP) {
      return (
        <SignInForm
          {...{
            label: 'Sign-in with LDAP',
            defaultUsername: 'riemann',
            defaultPassword: 'password',
            handle: async ({ username, password }) => {
              const result = await startIdpIntent(orgId, {
                idpId: identityProvider.id,
                ldap: {
                  username,
                  password,
                },
              });

              if (!result.idpIntent) {
                return;
              }

              // const intent = await retrieveIntent(orgId, {
              //   idpIntentId: result.idpIntent?.idpIntentId,
              //   idpIntentToken: result.idpIntent?.idpIntentToken,
              // });

              // console.log('intent', intent);

              const session = await login(orgId, {
                checks: {
                  user: {
                    userId: username,
                  },
                  idpIntent: {
                    idpIntentId: result.idpIntent?.idpIntentId,
                    idpIntentToken: result.idpIntent?.idpIntentToken,
                  },
                },
              });

              if (!session?.sessionId) {
                return;
              }

              if (!authRequestId) {
                window.location.href = '/';
                return;
              }

              finalizeAuthRequest(orgId, { authRequestId, session })
                .then((result) => {
                  if (result.callbackUrl) {
                    window.location.href = result.callbackUrl;
                  }
                })
                .catch((_) => {
                  window.location.href = '/';
                });
            },
          }}
        />
      );
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-24 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          </div>
        </div>

        <div className="max-w-7xl">
          <SignInForm
            {...{
              label: 'Sign-in',
              defaultUsername: 'lily',
              defaultPassword: 'Qwerty@123',
              handle: async ({ username, password }) => {
                const session = await login(orgId, {
                  checks: {
                    user: {
                      loginName: username,
                    },
                    password: {
                      password,
                    },
                  },
                });

                if (!session.sessionId) {
                  return;
                }

                if (!session.sessionToken) {
                  return;
                }

                if (!authRequestId) {
                  window.location.href = '/';
                  return;
                }

                finalizeAuthRequest(orgId, {
                  authRequestId,
                  session,
                })
                  .then((result) => {
                    if (result.callbackUrl) {
                      window.location.href = result.callbackUrl;
                    }
                  })
                  .catch((_) => {
                    window.location.href = '/';
                  });
              },
            }}
          />

          {identityProviders
            .sort((a, b) => Number(b.id) - Number(a.id))
            .map((identityProvider, index) => (
              <div key={index}>{renderIdentityProvider(identityProvider)}</div>
            ))}
        </div>
      </div>
    </div>
  );
}

function SignInForm(props: {
  defaultUsername: string;
  defaultPassword: string;
  label: string;
  handle: (params: { username: string; password: string }) => void;
}) {
  const { label, defaultUsername, defaultPassword, handle } = props;

  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);

  return (
    <div className="my-4">
      <h3 className="my-2 text-xl font-extrabold text-gray-900">{label}</h3>

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Username
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            // type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={() => handle({ username, password })}
        type="button"
        className="mt-4 group relative w-full flex justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign in
      </button>
    </div>
  );
}
