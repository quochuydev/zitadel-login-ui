/**
 * Minimal hand-written replacements for the generated gRPC types that the app
 * actually consumes (formerly the ./proto folder). Shapes mirror Zitadel's
 * REST (connect/grpc-gateway) JSON responses.
 */

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>;

export interface Details {
  sequence: number;
  changeDate?: Date;
  resourceOwner: string;
}

export interface ListDetails {
  totalResult: number;
  processedSequence: number;
  timestamp?: Date;
}

//#region Session service
export interface Session {
  id: string;
  creationDate?: Date;
  changeDate?: Date;
  sequence: number;
  factors?: Factors;
  metadata?: { [key: string]: unknown };
}

export interface Factors {
  user?: UserFactor;
  password?: PasswordFactor;
  webAuthN?: WebAuthNFactor;
  intent?: IntentFactor;
  totp?: TOTPFactor;
  otpSms?: OTPFactor;
  otpEmail?: OTPFactor;
}

export interface UserFactor {
  verifiedAt?: Date;
  id: string;
  loginName: string;
  displayName: string;
  organizationId: string;
}

export interface PasswordFactor {
  verifiedAt?: Date;
}

export interface IntentFactor {
  verifiedAt?: Date;
}

export interface WebAuthNFactor {
  verifiedAt?: Date;
  userVerified?: boolean;
}

export interface TOTPFactor {
  verifiedAt?: Date;
}

export interface OTPFactor {
  verifiedAt?: Date;
}

export interface SearchQuery {
  idsQuery?: { ids: string[] };
}

export interface Checks {
  user?: { userId?: string; loginName?: string };
  password?: { password: string };
  webAuthN?: { credentialAssertionData?: { [key: string]: any } };
  idpIntent?: { idpIntentId: string; idpIntentToken: string };
  totp?: { code: string };
  otpSms?: { code: string };
  otpEmail?: { code: string };
}

export interface RequestChallenges {
  webAuthN?: { domain: string; userVerificationRequirement: string };
  otpSms?: { returnCode: boolean };
  otpEmail?: { sendCode?: { urlTemplate?: string }; returnCode?: object };
}

export interface Challenges {
  webAuthN?: { publicKeyCredentialRequestOptions?: { [key: string]: any } };
  otpSms?: string;
  otpEmail?: string;
}

export interface ListSessionsRequest {
  query?: object;
  queries: SearchQuery[];
}

export interface ListSessionsResponse {
  details?: ListDetails;
  sessions: Session[];
}

export interface GetSessionResponse {
  session?: Session;
}

export interface CreateSessionRequest {
  checks?: Checks;
  metadata?: { [key: string]: unknown };
  challenges?: RequestChallenges;
}

export interface CreateSessionResponse {
  details?: Details;
  sessionId: string;
  sessionToken: string;
  challenges?: Challenges;
}

export interface SetSessionRequest {
  sessionId: string;
  sessionToken: string;
  checks?: Checks;
  metadata?: { [key: string]: unknown };
  challenges?: RequestChallenges;
}

export interface SetSessionResponse {
  details?: Details;
  sessionToken: string;
  challenges?: Challenges;
}

export interface DeleteSessionRequest {
  sessionId: string;
  sessionToken?: string;
}

export interface DeleteSessionResponse {
  details?: Details;
}
//#endregion

//#region OIDC service
export interface AuthRequest {
  id: string;
  creationDate?: Date;
  clientId: string;
  scope: string[];
  redirectUri: string;
  /** e.g. 'PROMPT_LOGIN' | 'PROMPT_CREATE' | 'PROMPT_SELECT_ACCOUNT' */
  prompt: string[];
  uiLocales: string[];
  loginHint?: string;
  maxAge?: object;
  hintUserId?: string;
}

export interface GetAuthRequestRequest {
  authRequestId: string;
}

export interface GetAuthRequestResponse {
  authRequest?: AuthRequest;
}

export interface CreateCallbackRequest {
  authRequestId: string;
  session?: { sessionId: string; sessionToken: string };
  error?: { error: string; errorDescription?: string; errorUri?: string };
}

export interface CreateCallbackResponse {
  details?: Details;
  callbackUrl: string;
}
//#endregion

//#region Settings service
export interface LoginSettings {
  allowUsernamePassword?: boolean;
  allowRegister?: boolean;
  allowExternalIdp?: boolean;
  forceMfa?: boolean;
  /** e.g. 'PASSKEYS_TYPE_NOT_ALLOWED' | 'PASSKEYS_TYPE_ALLOWED' */
  passkeysType?: string;
  hidePasswordReset?: boolean;
  ignoreUnknownUsernames?: boolean;
  defaultRedirectUri?: string;
  secondFactors?: string[];
  multiFactors?: string[];
  allowDomainDiscovery?: boolean;
  disableLoginWithEmail?: boolean;
  disableLoginWithPhone?: boolean;
  resourceOwnerType?: string;
  forceMfaLocalOnly?: boolean;
}

export interface IdentityProvider {
  id: string;
  name: string;
  type?: string;
}

export interface PasswordComplexityPolicy {
  details?: Details;
  minLength: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  isDefault?: boolean;
}
//#endregion

//#region Management service
export interface Application {
  id: string;
  details?: Details;
  state?: string;
  name: string;
  oidcConfig?: { clientId?: string; redirectUris?: string[] } & {
    [key: string]: any;
  };
  apiConfig?: { [key: string]: any };
  samlConfig?: { [key: string]: any };
}

export interface ListAppsResponse {
  details?: ListDetails;
  result?: Application[];
}
//#endregion

//#region Admin service
export interface ListEventsRequest {
  sequence?: number;
  limit?: number;
  asc?: boolean;
  editorUserId?: string;
  eventTypes?: string[];
  aggregateId?: string;
  aggregateTypes?: string[];
  resourceOwner?: string;
  creationDate?: Date;
}

export interface ListEventsResponse {
  events: Array<{ [key: string]: any }>;
}
//#endregion
