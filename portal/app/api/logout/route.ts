import { NextRequest, NextResponse } from 'next/server';
import { removeSessionFromCookie, getSessionCookieById } from '@/lib/cookies';
import { createSessionService } from '@/instrumentation-node';
import { DeleteSessionRequest } from '@/zitadel-server/proto/zitadel/session/v2beta/session_service';

export async function POST(request: NextRequest) {
  try {
    const body: DeleteSessionRequest = await request.json();
    const { ...data } = body;

    const sessionCookie = getSessionCookieById(data.sessionId);
    const sessionService = createSessionService(undefined);

    const result = await sessionService.deleteSession(sessionCookie);
    removeSessionFromCookie(data.sessionId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
