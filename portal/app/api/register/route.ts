import { NextRequest, NextResponse } from 'next/server';
import { addSessionToCookie } from '@/utils/cookies';
import { createUserClient, createSessionClient, getServiceAccount } from '@/instrumentation-node';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ...data } = body;

    const serviceAccount = getServiceAccount();
    const userService = createUserClient(serviceAccount);
    const sessionService = createSessionClient(serviceAccount);

    const newUser = await userService.addHumanUser(data);
    const userId = newUser.userId;

    const newSession = await sessionService.createSession({
      checks: {
        user: {
          userId,
        },
      },
    });

    addSessionToCookie({
      sessionId: newSession.sessionId,
      sessionToken: newSession.sessionToken,
      userId,
    });

    return NextResponse.json(newSession, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
