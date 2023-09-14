import { NextRequest, NextResponse } from 'next/server';
import { createOIDCService } from '@/instrumentation-node';
import { CreateCallbackRequest } from '@/zitadel-server/proto/zitadel/oidc/v2alpha/oidc_service';

export async function POST(request: NextRequest) {
  try {
    // const orgId = request.headers.get('x-zitadel-orgid');
    const body: CreateCallbackRequest = await request.json();
    const { ...data } = body;
    const { authRequestId, session } = data;

    const oidcService = createOIDCService();

    const result = await oidcService.createCallback({
      authRequestId,
      session,
    });

    console.log('result', result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
