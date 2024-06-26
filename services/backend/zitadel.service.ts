import configuration from '#/configuration';
import { objectToQueryString } from '#/lib/api-caller';
import { ROUTING } from '#/lib/router';
import {
  getIdpIdFromAuthRequest,
  getOrgIdFromAuthRequest,
  getProjectIdFromAuthRequest,
  getPromptFromAuthRequest,
} from '#/lib/zitadel';
import { PasswordComplexityPolicy } from '#/proto/zitadel/policy';
import AuthService from '#/services/backend/auth.service';
import CookieService from '#/services/backend/cookie.service';
import type {
  Application,
  AuthRequest,
  LoginSettings,
  Session,
  IdentityProvider,
} from '#/types/zitadel';

export async function getCurrentSessions() {
  const sessionIds = CookieService.getAllSessions().map((e) => e.sessionId);
  if (!sessionIds.length) return [];

  const accessToken = await AuthService.getAdminAccessToken();
  const sessionService = AuthService.createSessionService(accessToken);

  const sessions: Session[] = await sessionService
    .listSessions({
      queries: [
        {
          idsQuery: {
            ids: sessionIds,
          },
        },
      ],
    })
    .then((res) => res.sessions || []);

  return sessions.sort((a, b) => {
    const _a = new Date(a.creationDate as Date).getTime();
    const _b = new Date(b.creationDate as Date).getTime();
    return _a < _b ? 1 : -1;
  });
}

type AuthRequestInfo = {
  authRequest?: AuthRequest;
  application?: Application;
  loginSettings?: LoginSettings;
  orgDisplayName?: string;
  redirect?: string;
  passwordSettings?: PasswordComplexityPolicy;
  identityProviders?: IdentityProvider[];
};

export async function getAuthRequestInfo(params: {
  authRequest?: string;
  flow?: 'add';
}): Promise<AuthRequestInfo> {
  const { authRequest: authRequestId, flow } = params;

  const result: AuthRequestInfo = {
    authRequest: undefined,
    application: undefined,
    loginSettings: undefined,
    redirect: undefined,
    orgDisplayName: undefined,
    passwordSettings: undefined,
    identityProviders: undefined,
  };

  const accessToken = await AuthService.getAdminAccessToken();
  const oidcService = AuthService.createOIDCService(accessToken);
  const managementService = AuthService.createManagementService(accessToken);
  const settingService = AuthService.createSettingService(accessToken);
  const userService = AuthService.createUserService(accessToken);

  const authRequest = authRequestId
    ? await oidcService
        .getAuthRequest({ authRequestId })
        .then((e) => e.authRequest)
        .catch(() => undefined)
    : undefined;

  if (!authRequest) {
    const setting = await settingService.getPasswordComplexitySettings();
    result.passwordSettings = setting;
    result.loginSettings = await settingService.getLoginSettings();
    result.identityProviders =
      await settingService.getActiveIdentityProviders();
    return result;
  }

  result.authRequest = authRequest;

  const prompt = getPromptFromAuthRequest(authRequest);

  if (prompt === 'create') {
    result.redirect = objectToQueryString(ROUTING.REGISTER, {
      authRequest: authRequestId,
    });
    return result;
  }

  /**
   * from page /account/select to page /login
   * with query param 'flow=add', portal will not go to account/select page again
   */
  if (prompt === 'select_account') {
    if (flow !== 'add') {
      result.redirect = objectToQueryString(ROUTING.ACCOUNT_SELECT, {
        authRequest: authRequestId,
      });
      return result;
    }
  }

  const idpId = getIdpIdFromAuthRequest(authRequest);
  const orgId = getOrgIdFromAuthRequest(authRequest);

  if (idpId) {
    try {
      const successUrl = objectToQueryString(
        new URL(
          ROUTING.LOGIN_EXTERNAL_IDP_SUCCESS,
          configuration.appUrl,
        ).toString(),
        {
          authRequest: authRequestId,
        },
      );

      const failureUrl = objectToQueryString(
        new URL(
          ROUTING.LOGIN_EXTERNAL_IDP_FAIL,
          configuration.appUrl,
        ).toString(),
        {
          authRequest: authRequestId,
        },
      );

      const idpIntent = await userService.startIdentityProviderIntent({
        orgId,
        data: {
          idpId,
          urls: {
            successUrl,
            failureUrl,
          },
        },
      });

      if (idpIntent.authUrl) {
        const zitadelHost = new URL(configuration.zitadel.url).host;
        const forwarded = new URL(configuration.appUrl).host;
        result.redirect = idpIntent.authUrl.replace(zitadelHost, forwarded);
        return result;
      }
    } catch (error) {
      console.log('IDP intent started fail', error);
      result.redirect = ROUTING.NOT_FOUND;
      return result;
    }
  }

  if (orgId) {
    result.loginSettings = await settingService.getLoginSettings(orgId);
    result.identityProviders =
      await settingService.getActiveIdentityProviders(orgId);
    console.log(`debug:result.identityProviders`, result.identityProviders);
  }

  const projectId = getProjectIdFromAuthRequest(authRequest);

  if (projectId) {
    const applications = await managementService.searchApplications(projectId, {
      queries: [],
    });
    result.application = applications.find(
      (e) => e.oidcConfig?.clientId === authRequest.clientId,
    );
  }

  const setting = await settingService.getPasswordComplexitySettings(orgId);
  result.passwordSettings = setting;

  return result;
}
