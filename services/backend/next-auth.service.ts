import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import NextAuth, { NextAuthOptions } from 'next-auth';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ baseUrl }) {
      return new URL(baseUrl).toString();
    },
    async jwt({ token, user, account, profile }) {
      if (profile?.sub) {
        token.sub = profile.sub;
      }

      if (typeof user !== typeof undefined) {
        token.user = user;
      }

      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at; //seconds
      }
      return token;
    },
    async session({ session, token }: { session; token }) {
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

      session.sub = token.sub;
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.expiresAt = token.expiresAt;
      session.error = token.error;
      session.user = user;

      return session;
    },
  },
  providers: [
    {
      id: 'zitadel',
      name: 'zitadel',
      type: 'oauth',
      version: '2',
      wellKnown: `https://zitadel-login-ui-v2.vercel.app/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: [
            'openid',
            'userinfo',
            'email',
            'profile',
            'address',
            'offline_access',
            'urn:zitadel:iam:user:resourceowner',
            'urn:zitadel:iam:org:projects:roles',
            'urn:zitadel:iam:org:project:id:zitadel:aud',
          ].join(' '),
        },
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
          orgId: profile['urn:zitadel:iam:user:resourceowner:id'],
        };
      },
      clientId: '243317796283431053@myapp',
      httpOptions: {
        timeout: 10000,
      },
    },
  ],
};

export const handler = NextAuth(authOptions);
