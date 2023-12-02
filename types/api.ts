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
