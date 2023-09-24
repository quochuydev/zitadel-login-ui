import { GetSessionResponse } from '@/zitadel-server';
import type {
  CreateCallbackRequest,
  CreateCallbackResponse,
  GetAuthRequestRequest,
  GetAuthRequestResponse,
} from '@/zitadel-server/proto/zitadel/oidc/v2beta/oidc_service';
import { CreateSessionRequest, CreateSessionResponse } from '@/zitadel-server/proto/zitadel/session/v2beta/session_service';

/**
 * https://zitadel.com/docs/apis/resources/session_service/session-service-create-session
 */
export type CreateSession = {
  url: '/v2beta/sessions';
  method: 'post';
  data: CreateSessionRequest;
  result: CreateSessionResponse;
};

export type GetSession = {
  url: '/v2beta/sessions/{sessionId}';
  method: 'get';
  params: {
    sessionId: string;
  };
  result: GetSessionResponse;
};

export type GetAuthRequest = {
  url: '/v2beta/oidc/auth_requests/{authRequestId}';
  method: 'get';
  params: GetAuthRequestRequest;
  result: GetAuthRequestResponse;
};

export type CreateCallback = {
  url: '/v2beta/oidc/auth_requests/{authRequestId}';
  method: 'post';
  params: {
    authRequestId: string;
  };
  data: Pick<CreateCallbackRequest, 'session'>;
  result: CreateCallbackResponse;
};
