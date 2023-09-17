import { NextRequest, NextResponse } from 'next/server';
import { addSessionToCookie } from '@/lib/cookies';
import { createSessionService } from '@/instrumentation-node';
import { CreateSessionRequest } from '@/zitadel-server/proto/zitadel/session/v2alpha/session_service';

export async function POST(request: NextRequest) {
  try {
    // const orgId = request.headers.get('x-zitadel-orgid') as string;
    const body: CreateSessionRequest = await request.json();
    const { ...data } = body;

    const sessionService = createSessionService();

    const result = await sessionService.createSession(data);
    const session = await sessionService.getSession({ sessionId: result.sessionId }).then((e) => e.session);

    addSessionToCookie({
      sessionId: result.sessionId,
      sessionToken: result.sessionToken,
      userId: session?.factors?.user?.id as string,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
