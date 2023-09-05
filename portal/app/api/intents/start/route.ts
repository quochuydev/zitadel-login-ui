import { NextRequest, NextResponse } from 'next/server';
import { serviceAccount, createUserClient, OrgMetadata } from '@/instrumentation-node';
import { ClientMiddleware } from 'nice-grpc';
import { z } from 'zod';
import { StartIdentityProviderIntentRequest } from '@/zitadel-server';

const schema = z.object({
  orgId: z.string().trim().nonempty(),
});

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('org-id') as string;
    const body: StartIdentityProviderIntentRequest = await request.json();
    const { ...data } = body;

    console.log('orgId', orgId);
    console.log('request', data);

    schema.parse({ orgId });

    const interceptors: ClientMiddleware[] = [serviceAccount];

    if (orgId) {
      interceptors.push(OrgMetadata(orgId));
    }

    const userService = createUserClient(...interceptors);
    const result = await userService.startIdentityProviderIntent(data);

    console.log('result', result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
