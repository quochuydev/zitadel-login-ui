import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import * as z from 'zod';

type Configuration = {
  server: string;
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

if (process.env.DOT_ENV_PATH) {
  const dotenvPath = path.join(process.cwd(), process.env.DOT_ENV_PATH);
  const buffer = fs.readFileSync(dotenvPath);
  const defaultConfig = dotenv.parse(buffer);

  Object.entries(defaultConfig).forEach(([key, value]) => {
    if (!process.env[key]) process.env[key] = value;
  });
}

const configurationSchema = z.object({
  server: z.string(),
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
  server: process.env.SERVER || 'local',
  appUrl: process.env.APP_URL || 'http://localhost:3333',
  zitadel: {
    url: process.env.ZITADEL_URL as string,
    userId: process.env.ZITADEL_SERVICE_USER_ID as string,
    userToken: process.env.ZITADEL_SERVICE_USER_TOKEN as string,
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
