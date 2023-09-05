import { NextRequest, NextResponse } from 'next/server';
import { serviceAccount, createUserClient } from '@/instrumentation-node';
import { RetrieveIdentityProviderIntentRequest } from '@/zitadel-server';
import { z } from 'zod';

const schema = z.object({
  idpIntentId: z.string().trim().nonempty(),
  idpIntentToken: z.string().trim().nonempty(),
});

export async function POST(request: NextRequest) {
  try {
    const body: RetrieveIdentityProviderIntentRequest = await request.json();
    const { ...data } = body;

    schema.parse({ ...data });

    const userService = createUserClient(serviceAccount);
    const result = await userService.retrieveIdentityProviderIntent(data);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
