import { create } from '@submodule/core';
import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';

const configSchema = z.object({
  server: z.object({
    port: z.number(),
  }),
  zitadel: z.object({
    apiEndpoint: z.string().nonempty(),
    serviceAccountJSON: z.string().nonempty(),
  }),
});

export const config = create(() => {
  dotenvConfig();

  return configSchema.parse({
    server: {
      port: 4040,
    },
    zitadel: {
      apiEndpoint: 'https://system-siqqmi.zitadel.cloud',
      serviceAccountJSON: 'sa/227355825121810019.json',
    },
  });
});
