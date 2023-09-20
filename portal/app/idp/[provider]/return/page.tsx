import OidcReturn from '@/components/OidcReturn';
import RegisterButton from '@/components/RegisterButton';
import { createOIDCService, createUserService } from '@/instrumentation-node';
import { getOrgIdFromAuthRequest } from '@/lib/helper';
import { IDPInformation } from '@/zitadel-server';
import { AddHumanUserRequest } from '@/zitadel-server/proto/zitadel/user/v2beta/user_service';

const PROVIDER_MAPPING: {
  [provider: string]: (rI: IDPInformation) => Partial<AddHumanUserRequest>;
} = {
  google: (idp) => {
    const idpLink = {
      idpId: idp.idpId,
      userId: idp.userId,
      userName: idp.userName,
    };

    const req: Partial<AddHumanUserRequest> = {
      username: idp.userName,
      email: {
        email: idp.rawInformation?.User?.email,
        isVerified: true,
      },
      profile: {
        displayName: idp.rawInformation?.User?.name ?? '',
        givenName: idp.rawInformation?.User?.given_name ?? '',
        familyName: idp.rawInformation?.User?.family_name ?? '',
      },
      idpLinks: [idpLink],
    };

    return req;
  },
};

// LDAP;
// {
//   "details": {
//     "sequence": "8134",
//     "changeDate": "2023-08-25T04:52:27.130247Z",
//     "resourceOwner": "226742452134923939"
//   },
//   "idpInformation": {
//     "ldap": {
//       "attributes": {
//         "uid": [
//           "riemann"
//         ]
//       }
//     },
//     "idpId": "228628858058849475",
//     "userId": "riemann",
//     "rawInformation": {
//       "id": "riemann",
//       "preferredLanguage": "und"
//     }
//   }
// }

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: {
    id: string;
    token: string;
    user: string;
    authRequest: string;
  };
  params: {
    provider: string;
  };
}) {
  console.log({ searchParams, params });
  const { id: idpIntentId, token: idpIntentToken, user: userId, authRequest: authRequestId } = searchParams;
  const { provider } = params;

  const oidcService = createOIDCService();

  const authRequest = authRequestId
    ? await oidcService
        .getAuthRequest({ authRequestId })
        .then((e) => e.authRequest)
        .catch((_) => undefined)
    : undefined;

  console.log('authRequest', authRequest);

  const orgId = getOrgIdFromAuthRequest(authRequest);

  if (!orgId) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <p>Can not create user.</p>
      </div>
    );
  }

  const userService = createUserService();

  const idpInformation = await userService
    .retrieveIdentityProviderIntent({
      idpIntentId,
      idpIntentToken,
    })
    .then((e) => e.idpInformation)
    .catch((_) => undefined);

  if (!idpInformation) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <p>Invalid request.</p>
      </div>
    );
  }

  const userData = PROVIDER_MAPPING[provider](idpInformation);
  console.log('idpInformation', idpInformation);
  console.log('userData', userData);

  if (!userId) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <p>Creating user</p>
        <p>Loading...</p>
        <RegisterButton {...{ orgId, userData, authRequestId }} />
      </div>
    );
  }

  return (
    <OidcReturn
      {...{
        orgId,
        userId,
        idpIntentId,
        idpIntentToken,
        authRequestId,
      }}
    />
  );
}
