import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Default } from '#/lib/api-caller';
import * as z from 'zod';

export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  INVALID_DATA = 'INVALID_DATA',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

type ZodError = {
  code: 400;
  error: {
    code: number;
    message: string;
  };
};

type ZitadelError = {
  code: number;
  error: {
    code: number;
    details: Array<{
      id: string;
      message: string;
      '@type': string;
    }>;
    message: string;
  };
};

export const parseRequest = async <T>(request: NextRequest) => {
  const body: T = await request.json();
  return { body };
};

export const isValidRequest = <T>(params: {
  data: T;
  schema: z.ZodSchema<T>;
}) => {
  const { data, schema } = params;
  schema.parse(data);
};

export const ok = <T>(result?: T) => {
  return NextResponse.json(result || {}, { status: 200 });
};

export const error = (e: any) => {
  const { code: status, errors } = transformError(e) as {
    code: number;
    errors: {
      code: ErrorCode;
      message: string;
      error: unknown;
    };
  };
  return NextResponse.json(errors, { status });
};

export function transformError(error: Error | ZodError | ZitadelError) {
  const items = [
    {
      description: 'Zitadel API error',
      match: () => {
        const e = error as ZitadelError;
        return !!e.code && !!e.error?.details?.length && !!e.error?.message;
      },
      do: () => {
        const e = error as ZitadelError;

        const errorMap: { [key: string]: ErrorCode } = {
          'QUERY-Dfbg2': ErrorCode.NOT_FOUND,
          'COMMAND-SAF3g': ErrorCode.INVALID_DATA,
          'AUTHZ-Kl3p0': ErrorCode.UNAUTHORIZED,
        };

        return {
          code: e.code,
          errors: {
            code: errorMap[e.error.details[0].id] || ErrorCode.INVALID_DATA,
            message: e.error.message,
          },
        };
      },
    },
    {
      description: 'Zod validation error',
      match: () => {
        const e = error as ZodError;
        return !!e.code && !!e.error?.code && !!e.error?.message;
      },
      do: () => ({
        code: 400,
        errors: {
          code: ErrorCode.INVALID_DATA,
          message: (error as ZodError).error.message,
        },
      }),
    },
    {
      description: 'error instanceof Error',
      match: () => error instanceof Error && error.name === 'Error',
      do: () => ({
        code: 400,
        errors: {
          code: ErrorCode.INVALID_DATA,
          message: (error as Error).message,
        },
      }),
    },
    {
      description: 'Not yet handle',
      match: () => true,
      do: () => ({ code: 500, errors: { error } }),
    },
  ];

  for (const item of items) {
    if (item.match()) {
      return item.do();
    }
  }
}

export const defaultHandler = async <T extends Default>(
  params: {
    request: NextRequest;
    tracingName?: string;
  },
  handle: (body: T['data']) => Promise<T['result']>,
) => {
  const { request } = params;

  const userAgent = request.headers.get('user-agent');

  try {
    const { body } = await parseRequest<T['data']>(request);
    const result = await handle(body);
    return ok(result);
  } catch (err) {
    console.log(err);
    console.log('debug:', userAgent, JSON.stringify(err));
    return error(err);
  }
};
