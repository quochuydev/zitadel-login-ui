import { AuthRequest } from '@/zitadel-server/proto/zitadel/oidc/v2beta/authorization';

const orgIDScopePrefix = 'urn:zitadel:iam:org:id:';

export function getOrgIdFromAuthRequest(authRequest?: AuthRequest) {
  if (!authRequest) {
    return undefined;
  }

  const orgIDScope = authRequest?.scope?.find((e) => e.startsWith(orgIDScopePrefix));
  const orgId = orgIDScope ? orgIDScope.replace(orgIDScopePrefix, '') : undefined;
  return orgId;
}

export function getOrgScope(orgId: string) {
  return `${orgIDScopePrefix}${orgId}`;
}
