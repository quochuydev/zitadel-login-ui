import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import * as z from 'zod';

type Configuration = {
  appUrl: string;
  zitadel: {
    url: string;
    userId: string;
    userToken: string;
  };
  resend: {
    apiKey?: string;
  };
};

const DOT_ENV_PATH = process.env.DOT_ENV_PATH;

if (DOT_ENV_PATH) {
  const buffer = fs.readFileSync(path.join(process.cwd(), DOT_ENV_PATH));
  const defaultConfig = dotenv.parse(buffer);

  Object.entries(defaultConfig).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

const configurationSchema = z.object({
  appUrl: z.string(),
  zitadel: z.object({
    url: z.string(),
    userId: z.string(),
    userToken: z.string(),
  }),
  resend: z.object({
    apiKey: z.string().optional(),
  }),
});

const configuration: Configuration = {
  appUrl: process.env.APP_URL,
  zitadel: {
    url: process.env.ZITADEL_URL,
    userId: process.env.ZITADEL_SERVICE_USER_ID,
    userToken: process.env.ZITADEL_SERVICE_USER_TOKEN,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
  },
};

try {
  configurationSchema.parse(configuration);
} catch (error) {
  console.error('Bad configuration.', error);
  throw error;
}

export type { Configuration };
export default configuration;
