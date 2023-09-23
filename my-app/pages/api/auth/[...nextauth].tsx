import NextAuth, { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import fetch from 'node-fetch';

const clientId = '233104669482875562@garriocom'; //web
// const host = 'https://system-siqqmi.zitadel.cloud';
const host = 'https://portal.example.local';

const nextAuthOptions = (): NextAuthOptions => {
  return {
    callbacks: {
      async redirect({ baseUrl }) {
        return `${baseUrl}`;
      },
      async jwt({ token, user, account, profile }) {
        if (profile?.sub) {
          token.sub = profile.sub;
        }

        if (typeof user !== typeof undefined) {
          token.user = user;
        }

        if (account?.access_token) {
          token.accessToken = account.access_token;
        }

        if (account?.access_token) {
          token.refreshToken = account.refresh_token;
        }

        if (account?.expires_at) {
          token.expiresAt = account.expires_at;
        }

        // return refreshAccessToken(token);

        if (account?.expires_at && Date.now() > account?.expires_at * 1000) {
          return refreshAccessToken(token);
        }

        return token;
      },
      async session({ session, token }) {
        const { sub, accessToken } = token;

        const user = token.user as {
          id: string;
          firstName: string;
          lastName: string;
          orgId: string;
          metadata: {
            [key: string]: string;
          };
          roleMap: {
            [role: string]: {
              [orgId: string]: string;
            };
          };
        };

        console.log('debug token', token);
        console.log('debug session', session);

        session.sub = sub;
        session.accessToken = accessToken;
        session.user = user as unknown;

        return session;
      },
    },
    debug: true,
    providers: [
      {
        id: 'zitadel',
        name: 'Zitadel',
        type: 'oauth',
        version: '2',
        wellKnown: `${host}/.well-known/openid-configuration`,
        authorization: {
          params: {},
        },
        idToken: true,
        checks: ['pkce', 'state'],
        client: {
          token_endpoint_auth_method: 'none',
        },
        async profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email,
            loginName: profile.preferred_username,
            image: profile.picture,
            roleMap: profile['urn:zitadel:iam:org:project:roles'],
            metadata: profile['urn:zitadel:iam:user:metadata'],
            orgId: profile['urn:zitadel:iam:org:id'],
          };
        },
        clientId,
      },
    ],
  };
};

export default (request, response) => {
  return NextAuth(request, response, nextAuthOptions());
};

async function refreshAccessToken(token: JWT) {
  try {
    console.log('token', token);

    const searchParams = new URLSearchParams();
    searchParams.append('client_id', clientId);
    searchParams.append('grant_type', 'refresh_token');
    searchParams.append('refresh_token', token.refreshToken as string);

    const result: {
      access_token: string;
      token_type: string;
      refresh_token: string;
      expires_in: number;
      id_token: string;
    } = await fetch(`${host}/oauth/v2/token`, {
      method: 'POST',
      body: searchParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => res.json());

    console.log('refreshed token', result);

    return {
      ...token,
      expiresAt: (token.expiresAt as number) + result.expires_in,
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
