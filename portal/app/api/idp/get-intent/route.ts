import { NextRequest, NextResponse } from 'next/server';
import { getServiceAccount, createUserClient } from '@/instrumentation-node';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('org-id') as string;
    const body = await request.json();
    const { ...data } = body;

    const serviceAccount = getServiceAccount();
    const userService = createUserClient(serviceAccount);

    const result = await userService.retrieveIdentityProviderIntent(data);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
