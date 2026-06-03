/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
};

const nextTranslate = require('next-translate-plugin');
const config = nextTranslate(nextConfig);
config.i18n = undefined;
module.exports = config;
