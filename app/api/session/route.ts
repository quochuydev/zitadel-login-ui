import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '#/services/backend/next-auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json(session);
}
