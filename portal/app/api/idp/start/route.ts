import { NextRequest, NextResponse } from 'next/server';
import { serviceAccount, createUserClient, OrgMetadata } from '@/instrumentation-node';
import { ClientMiddleware } from 'nice-grpc';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orgId, ...data } = body;
    console.log('orgId', orgId);
    console.log('request', data);

    const interceptors: ClientMiddleware[] = [serviceAccount];

    if (orgId) {
      interceptors.push(OrgMetadata(orgId));
    }

    const userService = createUserClient(...interceptors);
    const result = await userService.startIdentityProviderIntent(data);

    console.log('result:', result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
