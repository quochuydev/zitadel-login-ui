import configuration from '#/configuration';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import i18n from './i18n';

export function middleware(request: NextRequest) {
  if (
    !i18n.locales.some((locale) => request.nextUrl.href.includes(`/${locale}`))
  ) {
    return NextResponse.redirect(
      new URL(
        `/${i18n.defaultLocale}${request.nextUrl.pathname}${request.nextUrl.search}`,
        configuration.appUrl,
      ),
    );
  }
}

export const config = {
  matcher: [
    '/((?!auth|oauth|.well-known|oidc|idps|logout|api|_next|.*\\..*).*)',
  ],
};
