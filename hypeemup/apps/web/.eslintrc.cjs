module.exports = {
  root: true,
  extends: ['../../packages/config/eslint.base.cjs', 'next', 'next/core-web-vitals'],
  parserOptions: {
    project: __dirname + '/tsconfig.json',
  },
  settings: {
    next: {
      rootDir: __dirname,
    },
  },
};
