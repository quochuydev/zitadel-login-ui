import type { AuthRequest } from '#/types/zitadel';

const projectIdScopePrefix = 'urn:zitadel:iam:org:project:id:';
const projectIdScopeSuffix = ':aud';
const apiAccessScope = 'urn:zitadel:iam:org:project:id:zitadel:aud';
const orgIdScopePrefix = 'urn:zitadel:iam:org:id:';
const roleScopePrefix = 'urn:zitadel:iam:org:project:role:';
const idpIdScopePrefix = 'urn:zitadel:iam:org:idp:id:';

type Prompt =
  | 'PROMPT_UNSPECIFIED'
  | 'PROMPT_LOGIN'
  | 'PROMPT_CREATE'
  | 'PROMPT_SELECT_ACCOUNT';

export function getPromptFromAuthRequest(
  authRequest?: AuthRequest,
): 'login' | 'create' | 'select_account' {
  if (authRequest) {
    const prompts = (authRequest.prompt as unknown as Prompt[]) || [];
    if (prompts.includes('PROMPT_LOGIN')) return 'login';
    if (prompts.includes('PROMPT_CREATE')) return 'create';
    if (prompts.includes('PROMPT_SELECT_ACCOUNT')) return 'select_account';
  }
  return 'login';
}

export function getProjectIdFromAuthRequest(authRequest?: AuthRequest) {
  if (!authRequest) return undefined;

  const scope = authRequest.scope.find(
    (e) => e.startsWith(projectIdScopePrefix) && e !== apiAccessScope,
  );
  if (!scope) return undefined;

  return scope
    .replace(projectIdScopePrefix, '')
    .replace(projectIdScopeSuffix, '');
}

export function getOrgIdFromAuthRequest(authRequest?: AuthRequest) {
  if (!authRequest) return undefined;
  const scope = authRequest.scope.find((e) => e.startsWith(orgIdScopePrefix));
  return scope ? scope.replace(orgIdScopePrefix, '') : undefined;
}

export function getIdpIdFromAuthRequest(authRequest?: AuthRequest) {
  if (!authRequest) return undefined;
  const scope = authRequest.scope.find((e) => e.startsWith(idpIdScopePrefix));
  return scope ? scope.replace(idpIdScopePrefix, '') : undefined;
}

export function getRolesFromAuthRequest(authRequest?: AuthRequest) {
  const roles: string[] = [];

  if (!authRequest) return roles;

  for (const scope of authRequest.scope) {
    if (scope.startsWith(roleScopePrefix)) {
      const role = scope.replace(roleScopePrefix, '');
      roles.push(role);
    }
  }

  return roles;
}
