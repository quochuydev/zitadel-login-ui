import configuration from '#/configuration';
import { findFirstMatch } from '#/helpers/job-executor';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function handler(request: NextRequest) {
  const forwarded = new URL(configuration.appUrl).host;
  const zitadelUrl = configuration.zitadel.url;

  const url = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    zitadelUrl,
  ).toString();

  const headers = new Headers();
  headers.set('x-zitadel-login-client', configuration.zitadel.userId);
  headers.set('x-zitadel-forwarded', `host="${forwarded}"`);

  const contentType = request.headers.get('content-type');
  contentType && headers.set('content-type', contentType);

  const authorization = request.headers.get('authorization');
  authorization && headers.set('authorization', authorization);

  try {
    const body = await getRequestBody(request);

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    });

    const redirect = findFirstMatch([
      {
        match: url.includes('/oidc/v1/end_session') && response.redirected,
        value: getPostLogoutRedirectUrl(request),
      },
      {
        match: url.includes('/oauth/v2/authorize') && response.redirected,
        value: response.url.replace(zitadelUrl, configuration.appUrl),
      },
      {
        match: url.includes('/idps/callback') && response.redirected,
        value: response.url.replace(zitadelUrl, configuration.appUrl),
      },
    ]);

    if (redirect) return NextResponse.redirect(redirect);

    const data = await response
      .json()
      .catch(() => ({ error: response.statusText }));

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Internal server error',
      },
      {
        status: 500,
      },
    );
  }
}

function getPostLogoutRedirectUrl(request: NextRequest) {
  const redirectUrl = request.nextUrl.searchParams.get(
    'post_logout_redirect_uri',
  );

  return redirectUrl || new URL('/logout', configuration.appUrl).toString();
}

async function getRequestBody(request: NextRequest) {
  const contentType = request.headers.get('content-type');

  if (
    contentType?.toLowerCase()?.includes('application/x-www-form-urlencoded')
  ) {
    const searchParams = new URLSearchParams();
    const formData = await request.formData();

    formData.forEach((value, key) => {
      searchParams.append(key, value.toString());
    });

    return searchParams;
  }

  return request.body ? JSON.stringify(request.body) : undefined;
}
