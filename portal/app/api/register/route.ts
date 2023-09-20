import { NextRequest, NextResponse } from 'next/server';
import { addSessionToCookie } from '@/lib/cookies';
import { createUserService, createSessionService } from '@/instrumentation-node';
import { AddHumanUserRequest } from '@/zitadel-server/proto/zitadel/management';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('org-id') as string;
    const body: AddHumanUserRequest = await request.json();
    const { ...data } = body;

    const userService = createUserService(orgId);
    const sessionService = createSessionService(orgId);

    const newUser = await userService.addHumanUser(data);
    const userId = newUser.userId;

    const session = await sessionService.createSession({
      checks: {
        user: {
          userId,
        },
      },
    });

    addSessionToCookie({
      sessionId: session.sessionId,
      sessionToken: session.sessionToken,
      userId,
    });

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
