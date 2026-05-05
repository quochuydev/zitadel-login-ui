/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: './proto',
  },
};

const nextTranslate = require('next-translate-plugin');
const config = nextTranslate(nextConfig);
config.i18n = undefined;
module.exports = config;
