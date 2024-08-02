export type APILogin = {
  url: '/api/login';
  method: 'post';
  data: {
    username: string;
    password: string;
    authRequestId?: string;
  };
  result: {
    changeRequired: boolean;
    userId: string;
    callbackUrl?: string;
  };
};

export type APIVerifyPasskey = {
  url: '/api/passkey/verify';
  method: 'post';
  data: {
    orgId: string;
    userId: string;
    passkeyId: string;
    credential: any;
  };
  result: void;
};

export type APIStartPasskey = {
  url: '/api/passkey/start';
  method: 'post';
  data: {
    username: string;
    authRequestId?: string;
    challenges?: any;
    webAuthN?: any;
  };
  result: {
    userId: string;
    challenges: any;
  };
};

export type APILoginPasskey = {
  url: '/api/passkey/login';
  method: 'post';
  data: {
    username: string;
    webAuthN: any;
  };
  result: {
    userId: string;
  };
};

export type APILogout = {
  url: '/api/logout';
  method: 'post';
  data: {
    sessionId: string;
  };
  result: void;
};

export type APIFinalizeAuthRequest = {
  url: '/api/auth_request/finalize';
  method: 'post';
  data: {
    authRequestId: string;
    userId: string;
  };
  result: {
    callbackUrl: string;
  };
};

export type APIChangePassword = {
  url: '/api/users/password';
  method: 'post';
  data: {
    orgId: string;
    userId: string;
    currentPassword: string;
    newPassword: string;
  };
  result: void;
};

export type APIRegister = {
  url: '/api/register';
  method: 'post';
  data: {
    orgId?: string;
    username: string;
    email: string;
    givenName: string;
    familyName: string;
    password: string;
    authRequestId?: string;
  };
  result: {
    userId: string;
    callbackUrl?: string;
  };
};

export type APILoginExternal = {
  url: '/api/external/login';
  method: 'post';
  data: {
    idpIntentId: string;
    idpIntentToken: string;
    userId: string;
  };
  result: void;
};

export type APIRequestCode = {
  url: '/api/users/request-code';
  method: 'post';
  data: {
    username: string;
  };
  result: void;
};

export type APIVerifyCode = {
  url: '/api/users/verify-code';
  method: 'post';
  data: {
    userId: string;
    orgId: string;
    verificationCode: string;
    password: string;
  };
  result: void;
};

export type APIStartExternal = {
  url: '/api/external/start';
  method: 'post';
  data: {
    orgId?: string;
    idpId: string;
    authRequestId?: string;
  };
  result: {
    authUrl: string;
  };
};

export type APIExternalLinkIDP = {
  url: '/api/external/linkIdp';
  method: 'post';
  data: {
    userId: string;
    idpLink: {
      idpId: string;
      userId: string;
      userName: string;
    };
  };
};

// TOTP
export type APIStartTOTP = {
  url: '/api/totp/start';
  method: 'post';
  data: {
    orgId: string;
    userId: string;
  };
  result: {
    secret: string;
    uri: string;
  };
};

export type APIVerifyTOTP = {
  url: '/api/totp/verify';
  method: 'post';
  data: {
    orgId: string;
    userId: string;
    code: string;
  };
  result: void;
};

export type APILoginTOTP = {
  url: '/api/totp/login';
  method: 'post';
  data: {
    username: string;
  };
  result: {
    userId: string;
  };
};
