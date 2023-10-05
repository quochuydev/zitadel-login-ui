import { defineConfig } from 'vitest/config';
import file from 'fs';

const setupFiles = file.existsSync(`./vitest.setup.ts`) ? [`./vitest.setup.ts`] : [];

export default defineConfig({
  test: {
    globals: true,
    include: [`./**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`],
    setupFiles,
    reporters: ['default', 'junit'],
    outputFile: `./reports/report.xml`,
  },
});
