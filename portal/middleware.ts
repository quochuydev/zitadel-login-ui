import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { config as appConfig } from '@/config';

export const config = {
  matcher: ['/.well-known/:path*', '/oauth/:path*', '/oidc/:path*'],
};

const INSTANCE = process.env.ZITADEL_API_URL;
const SERVICE_USER_ID = process.env.ZITADEL_SERVICE_USER_ID;

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-zitadel-login-client', SERVICE_USER_ID);

  console.log('intercept', request.nextUrl.pathname);

  request.nextUrl.href = `${appConfig.apiEndpoint}${request.nextUrl.pathname}${request.nextUrl.search}`;
  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}
