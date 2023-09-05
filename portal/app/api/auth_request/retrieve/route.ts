import { NextRequest, NextResponse } from 'next/server';
import { createOIDCClient, serviceAccount, ClientMiddleware } from '@/instrumentation-node';
import { GetAuthRequestRequest } from '@/zitadel-server/proto/zitadel/oidc/v2alpha/oidc_service';

export async function POST(request: NextRequest) {
  try {
    const body: GetAuthRequestRequest = await request.json();
    const { ...data } = body;
    const { authRequestId } = data;

    const interceptors: ClientMiddleware[] = [serviceAccount];
    const oidcService = createOIDCClient(...interceptors);

    const result = await oidcService.getAuthRequest({
      authRequestId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
