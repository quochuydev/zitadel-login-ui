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

export type APIWebAuthNStart = {
  url: '/api/webAuthN/start';
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

export type APIWebAuthNLogin = {
  url: '/api/webAuthN/login';
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
    orgId: string;
    givenName: string;
    familyName: string;
    email: string;
    password: string;
    projectId?: string;
    authRequestId?: string;
  };
  result: {
    userId: string;
    callbackUrl?: string;
  };
};

export type APILoginExternal = {
  url: '/api/login/external';
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
  result: {
    code: string;
    userId: string;
    orgId: string;
  };
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
