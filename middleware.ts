import configuration from '#/configuration';
import { ROUTING } from '#/types/router';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/', '/password'],
};

export function middleware(request: NextRequest) {
  const index = 0;

  return NextResponse.redirect(
    new URL(
      `${ROUTING.ACCOUNT}/${index}${request.nextUrl.pathname}${request.nextUrl.search}`,
      configuration.appUrl,
    ),
  );
}
