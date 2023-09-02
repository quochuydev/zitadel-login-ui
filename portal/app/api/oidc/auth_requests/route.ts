import { NextRequest, NextResponse } from 'next/server';
import { OrgMetadata, createOIDCClient, serviceAccount, ClientMiddleware } from '@/instrumentation-node';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orgId, authRequestId, session } = body;

    const interceptors: ClientMiddleware[] = [serviceAccount];

    if (orgId) {
      interceptors.push(OrgMetadata(orgId));
    }

    const oidcService = createOIDCClient(...interceptors);

    const result = await oidcService.createCallback({
      authRequestId,
      session: {
        sessionId: session.sessionId,
        sessionToken: session.sessionToken,
      },
    });

    console.log('result', result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
