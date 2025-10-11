import baseConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: ['**/dist'],
  },
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
