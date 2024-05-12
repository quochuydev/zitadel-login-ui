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

  const extra: any = {};
  extra.date = new Date();
  extra.url = url;
  extra.forwarded = forwarded;
  extra.method = request.method;
  extra.contentType = request.headers.get('content-type');
  extra.contentLength = request.headers.get('content-length');

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('x-forwarded-host');
  headers.delete('content-length');
  headers.set('x-zitadel-login-client', configuration.zitadel.userId);
  headers.set('x-zitadel-forwarded', `host="${forwarded}"`);

  try {
    const body = await getRequestBody(request);

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    });

    const redirect = findFirstMatch([
      {
        match: request.url.includes('/oidc/v1/end_session'),
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

    extra.status = response.status;
    extra.statusText = response.statusText;
    extra.responseUrl = response.url;
    extra.redirected = response.redirected;
    extra.redirect = redirect;
    console.log(`debug:extra`, extra);

    if (redirect) return NextResponse.redirect(redirect);

    const data = await response.json().catch((error) => {
      console.log(`debug:json`, error);
      return { error: response.statusText };
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    extra.error = error.message;

    console.log(`debug:extra`, extra);
    console.log(`debug:error`, error);

    const redirect = findFirstMatch([
      {
        match: request.url.includes('/oidc/v1/end_session'),
        value: getPostLogoutRedirectUrl(request),
      },
    ]);

    if (redirect) return NextResponse.redirect(redirect);

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
  return (
    request.nextUrl.searchParams.get('post_logout_redirect_uri') || '/logout'
  );
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
