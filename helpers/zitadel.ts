import type { AuthRequest } from '#/types/zitadel';

const projectIdScopePrefix = 'urn:zitadel:iam:org:project:id:';
const projectIdScopeSuffix = ':aud';
const apiAccessScope = 'urn:zitadel:iam:org:project:id:zitadel:aud';
const orgIdScopePrefix = 'urn:zitadel:iam:org:id:';
const roleScopePrefix = 'urn:zitadel:iam:org:project:role:';

export function getProjectIdFromAuthRequest(authRequest?: AuthRequest) {
  if (!authRequest) return undefined;

  const scope = authRequest.scope.find(
    (e) => e.startsWith(projectIdScopePrefix) && e !== apiAccessScope,
  );
  if (!scope) return undefined;

  const projectId = scope
    .replace(projectIdScopePrefix, '')
    .replace(projectIdScopeSuffix, '');
  return projectId;
}

export function getOrgIdFromAuthRequest(authRequest?: AuthRequest) {
  if (!authRequest) return undefined;

  const scope = authRequest.scope.find((e) => e.startsWith(orgIdScopePrefix));
  if (!scope) return undefined;

  const orgId = scope.replace(orgIdScopePrefix, '');
  return orgId;
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
