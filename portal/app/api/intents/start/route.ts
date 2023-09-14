import { NextRequest, NextResponse } from 'next/server';
import { createUserService } from '@/instrumentation-node';
import { z } from 'zod';
import { StartIdentityProviderIntentRequest } from '@/zitadel-server';

const schema = z.object({
  orgId: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-zitadel-orgid') as string;
    const body: StartIdentityProviderIntentRequest = await request.json();
    const { ...data } = body;
    schema.parse({ orgId });

    const userService = createUserService({ orgId });
    const result = await userService.startIdentityProviderIntent(data);

    console.log('result', result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
