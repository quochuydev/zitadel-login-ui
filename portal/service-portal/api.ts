import fetch from 'node-fetch';
import https from 'https';
import fs from 'fs';
import path from 'path';

type Default = {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  params?: object;
  query?: object;
  data?: unknown;
  result?: unknown;
};

type Credentials = {
  clientId: string;
  clientSecret: string;
};

type Request<T extends Default> = {
  url: T['url'];
  params?: T['params'];
  query?: T['query'];
  method?: T['method'];
  headers?: { [key: string]: string };
  data?: T['data'];
  credentials?: Credentials;
  before?: (options: RequestInit) => Promise<void>;
};

type Response<T extends Default> = T['result'];

async function sendRequest<T extends Default>(host: string, request: Request<T>): Promise<Response<T>> {
  const {
    url,
    params,
    query,
    method = 'post',
    headers = {
      'Content-Type': 'application/json',
    },
    data,
    before,
    credentials,
  } = request;

  const options: any = {
    method,
    headers,
    agent: new https.Agent({
      ca: fs.readFileSync(path.join(process.cwd(), 'localhost.crt')),
    }),
  };

  if (data) {
    if (headers['Content-Type'] === 'application/json') {
      options.body = JSON.stringify(data);
    }

    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      options.body = data as BodyInit;
    }
  }

  if (credentials) {
    const accessToken = await getClientCredentialsToken({
      host,
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
    });

    options.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (before) {
    await before(options);
  }

  const compiledUrl = params ? compile<T>(url, params) : url;

  const pathUrl = query ? objectToQueryString(compiledUrl, query) : compiledUrl;

  const result = await fetch(new URL(pathUrl, host).toString(), options).then((res) => res.json());

  console.log('*****', pathUrl, result);

  return result;
}

async function getClientCredentialsToken(params: { host: string; clientId: string; clientSecret: string }): Promise<string> {
  const { host, clientId, clientSecret } = params;

  const searchParams = new URLSearchParams();
  searchParams.append('grant_type', 'client_credentials');
  searchParams.append('client_id', clientId);
  searchParams.append('client_secret', clientSecret);
  searchParams.append('scope', 'openid profile email urn:zitadel:iam:org:project:id:zitadel:aud');

  const result: {
    access_token: string;
  } = await fetch(new URL('/oauth/v2/token', host).toString(), {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    agent: new https.Agent({
      ca: fs.readFileSync(path.join(process.cwd(), 'localhost.crt')),
    }),
    body: searchParams,
  }).then((res) => res.json());

  return result.access_token;
}

function compile<T extends Pick<Default, 'url' | 'params'>>(url: T['url'], data: T['params']) {
  return url.toString().replace(/{.+?}/g, function (matcher) {
    let path = matcher.slice(1, -1).trim();
    const value = path.split('.').reduce((obj, key) => obj[key], data);
    return value !== undefined ? value : '';
  });
}

function objectToQueryString(url: string, query: object): string {
  const queryString = Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');

  return url.includes('?') ? `${url}${queryString}` : `${url}?${queryString}`;
}

export const PortalService = (host: string) => {
  return {
    request: <T extends Default>(request: Request<T>) => sendRequest(host, request),
    getClientCredentialsToken: (clientId: string, clientSecret: string) =>
      getClientCredentialsToken({ host, clientId, clientSecret }),
  };
};
