import fs from 'fs';
import path from 'path';
import DIService from '../service-di';
import type { AddIAMMember, AddUserGrant, CreateHumanUser, CreateOIDCApp } from '@garrio/jupiter-foundation/service-portal';
import * as yup from 'yup';

describe('zitadel-sysadmin-authenticate', () => {
  const schema = yup.object({
    sysadminURL: yup.string().trim().required(),
    issuer: yup.string().trim().required(),
    garrioOrgId: yup.string().trim().required(),
    garrioCOMProjectId: yup.string().trim().required(),
    devMode: yup.string().trim().oneOf(['true', 'false']).required(),
  });

  const sysadminURL = process.env.PORTAL_SYS_ADMIN_URL;
  const issuer = process.env.PORTAL_ISSUER;
  const garrioOrgId = process.env.PORTAL_GARRIO_ORG_ID;
  const garrioCOMProjectId = process.env.PORTAL_GARRIO_COM_PROJECT_ID;

  schema.validateSync({
    sysadminURL,
    issuer,
    garrioOrgId,
    garrioCOMProjectId,
    devMode: process.env.PORTAL_DEV_MODE,
  });

  const devMode = process.env.PORTAL_DEV_MODE === 'true';

  beforeAll(async () => {
    const injection = DIService.getInjection();
    const { portalService } = injection;

    // const accessToken = await portalService.getServiceUserToken({
    //   grantType: 'client_credentials',
    //   clientId: 'system',
    //   clientSecret: '',
    // });

    const serviceAccountInfo: {
      userId: string;
      keyId: string;
      key: string;
    } = JSON.parse(
      fs.readFileSync(path.join(__dirname, './sa.json'), {
        encoding: 'utf-8',
      }),
    );

    const accessToken = await portalService.getServiceUserToken({
      grantType: 'jwt-bearer',
      issuer,
      key: serviceAccountInfo.key,
      keyId: serviceAccountInfo.key,
      userId: serviceAccountInfo.key,
    });

    const garrioUser = await portalService.request<CreateHumanUser>({
      url: '/v2beta/users/human',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-zitadel-orgid': garrioOrgId,
      },
      data: {
        profile: {
          givenName: 'System',
          familyName: 'Admin',
          displayName: 'System Admin',
          gender: 'GENDER_UNSPECIFIED',
        },
        username: 'sysadmin',
        email: {
          email: 'sysadmin@garrio.de',
          isVerified: true,
        },
        password: {
          password: '$Admin123',
          changeRequired: false,
        },
      },
    });

    await portalService.request<AddUserGrant>({
      url: '/management/v1/users/{userId}/grants',
      params: {
        userId: garrioUser.userId,
      },
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-zitadel-orgid': garrioOrgId,
      },
      data: {
        projectId: garrioCOMProjectId,
        roleKeys: ['SYS_ADMIN'],
      },
    });

    await portalService.request<AddIAMMember>({
      url: '/admin/v1/members',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        roles: ['IAM_ORG_MANAGER'],
        userId: garrioUser.userId,
      },
    });

    const garrioCOMSysadminWebApp = await portalService.request<CreateOIDCApp>({
      url: '/management/v1/projects/{projectId}/apps/oidc',
      method: 'post',
      params: {
        projectId: garrioCOMProjectId,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-zitadel-orgid': garrioOrgId,
      },
      data: {
        name: 'Web - Sysadmin',
        appType: 'OIDC_APP_TYPE_WEB',
        accessTokenType: 'OIDC_TOKEN_TYPE_BEARER',
        authMethodType: 'OIDC_AUTH_METHOD_TYPE_BASIC',
        grantTypes: ['OIDC_GRANT_TYPE_AUTHORIZATION_CODE'],
        responseTypes: ['OIDC_RESPONSE_TYPE_CODE'],
        version: 'OIDC_VERSION_1_0',
        redirectUris: [new URL('/api/auth/callback/portal', sysadminURL).toString()],
        postLogoutRedirectUris: [new URL(sysadminURL).toString()],
        accessTokenRoleAssertion: true,
        idTokenRoleAssertion: true,
        idTokenUserinfoAssertion: true,
        devMode,
      },
    });

    const data = {
      garrio: {
        humanUsers: [
          {
            userId: garrioUser.userId,
          },
        ],
        projects: [
          {
            applications: [
              {
                clientId: garrioCOMSysadminWebApp.clientId,
              },
            ],
          },
        ],
      },
    };

    console.log('data', JSON.stringify(data, null, 2));
  });

  test('Verify Zital initial', async () => {
    expect(true).toBeTruthy();
  });
});
