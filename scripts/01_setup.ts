import fetch from 'node-fetch';
// import https from 'https';
import fs from 'fs';
import path from 'path';
import * as jwt from 'jsonwebtoken';

(async () => {
  console.log('start');

  await getServiceAccountToken({
    host: 'https://system-siqqmi.zitadel.cloud',
  });

  console.log('end');
})();

async function getServiceAccountToken(params: { host: string }): Promise<string> {
  const { host } = params;

  const content = fs.readFileSync(path.join(process.cwd(), 'scripts/sa.json'), {
    encoding: 'utf-8',
  });

  const serviceAccount = JSON.parse(content) as {
    type: string;
    keyId: string;
    key: string;
    userId: string;
  };

  const assertion: string = jwt.sign(
    {
      iss: serviceAccount.userId,
      sub: serviceAccount.userId,
      aud: host,
      exp: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
      iat: Math.floor(Date.now() / 1000),
    },
    serviceAccount.key,
    {
      header: {
        alg: 'RS256',
        kid: serviceAccount.keyId,
      },
    },
  );

  const searchParams = new URLSearchParams();
  searchParams.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  searchParams.append('scope', 'openid profile email urn:zitadel:iam:org:project:id:zitadel:aud');
  searchParams.append('assertion', assertion);

  const result = await sendRequest<ClientCredentialsToken>(host, {
    url: '/oauth/v2/token',
    method: 'post',
    data: searchParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return result.access_token;
}

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
  after?: (result: T['result']) => Promise<void>;
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
    after,
    credentials,
  } = request;

  const options: RequestInit = {
    headers,
    method,
  };

  if (data) {
    if (options.headers['Content-Type'] === 'application/json') {
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

  const response = await fetch(new URL(pathUrl, host).toString(), options);

  const result = await response.json();

  if (response.status >= 400) {
    throw {
      code: response.status,
      error: result,
    };
  }

  console.log('*****', pathUrl, result); //TODO remove later

  if (after) {
    await after(result);
  }

  return result;
}

type ClientCredentialsToken = {
  url: '/oauth/v2/token';
  method: 'post';
  result: {
    access_token: string;
  };
};

async function getClientCredentialsToken(params: { host: string; clientId: string; clientSecret: string }): Promise<string> {
  const { host, clientId, clientSecret } = params;

  const searchParams = new URLSearchParams();
  searchParams.append('grant_type', 'client_credentials');
  searchParams.append('client_id', clientId);
  searchParams.append('client_secret', clientSecret);
  searchParams.append('scope', 'openid profile email urn:zitadel:iam:org:project:id:zitadel:aud');

  const result = await sendRequest<ClientCredentialsToken>(host, {
    url: '/oauth/v2/token',
    method: 'post',
    data: searchParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return result.access_token;
}

function compile<T extends Pick<Default, 'url' | 'params'>>(url: T['url'], data: T['params']) {
  return url.toString().replace(/{.+?}/g, (matcher) => {
    const path = matcher.slice(1, -1).trim();
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
