module.exports = {
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'auth', 'security'],
    '/[lang]/account/select': ['account_select'],
  },
  logBuild: false,
};
