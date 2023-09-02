import NextAuth from 'next-auth';

export default NextAuth({
  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}`;
    },
    async jwt({ token, user, account, profile }) {
      if (profile?.sub) {
        token.sub = profile.sub;
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      token.idToken ??= account?.id_token;
      if (typeof user !== typeof undefined) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }) {
      const { id, sub, user, error: tokenError, accessToken, idToken } = token;

      session.accessToken = accessToken;
      session.id = id;
      session.sub = sub;
      session.user = user;
      session.idToken = idToken;
      session.error = tokenError;

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
      wellKnown: `https://portal.local/.well-known/openid-configuration`,
      // wellKnown: `https://system-siqqmi.zitadel.cloud/.well-known/openid-configuration`,
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
          roles: profile['urn:zitadel:iam:org:project:roles'],
        };
      },
      clientId: '229793446041332810@app', //web
    },
  ],
});
