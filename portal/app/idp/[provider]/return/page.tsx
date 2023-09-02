import OIDCReturn from '@/components/OIDCReturn';
// import RegisterButton from '@/components/RegisterButton';
// import { getServiceAccount, createUserClient } from '@/instrumentation-node';

const PROVIDER_MAPPING = {
  google: (idp: any) => {
    const idpLink = {
      idpId: idp.idpId,
      userId: idp.userId,
      userName: idp.userName,
    };

    const req = {
      username: idp.userName,
      email: {
        email: idp.rawInformation?.User?.email,
        isVerified: true,
      },
      profile: {
        displayName: idp.rawInformation?.User?.name ?? '',
        firstName: idp.rawInformation?.User?.given_name ?? '',
        lastName: idp.rawInformation?.User?.family_name ?? '',
      },
      idpLinks: [idpLink],
    };

    return req;
  },
  ldap: (idp: any) => {
    const idpLink = {
      idpId: idp.idpId,
      userId: idp.userId,
      userName: idp.userId,
    };

    const req = {
      username: idp.userId,
      email: {
        // email: idp.rawInformation?.id,
        isVerified: true,
      },
      profile: {
        displayName: idp.rawInformation?.id ?? '',
        firstName: idp.rawInformation?.id ?? '',
        lastName: idp.rawInformation?.id ?? '',
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

export default async function ({ searchParams, params }: any) {
  console.log({ searchParams, params });
  const { id: intentId, token, user: userId, authRequest: authRequestId } = searchParams;
  // const { provider } = params;

  // const serviceAccount = getServiceAccount();
  // const userService = createUserClient(serviceAccount);

  // const result = await userService.retrieveIdentityProviderIntent({
  //   idpIntentId: intentId,
  //   idpIntentToken: token,
  // });

  // const idpInformation = result.idpInformation;
  // const userData = PROVIDER_MAPPING[provider as 'google'](idpInformation);
  // console.log('result', result);
  // console.log('userData', userData);

  if (!userId) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h1>User not existing in system</h1>
        {/* <RegisterButton userData={userData} authRequestId={authRequestId} /> */}
      </div>
    );
  }

  return (
    <OIDCReturn
      {...{
        userId,
        token,
        intentId,
        authRequestId,
      }}
    />
  );
}
