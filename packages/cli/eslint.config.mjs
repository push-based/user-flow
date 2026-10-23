import baseConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: [
      '**/dist/**',
      'vite.config.mts',
      '**/*.config.ts',
      '**/*.config.mts',
      'eslint.config.mjs',
      'src/cli.mjs',
      'docs/**',
    ],
  },
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['packages/cli/tsconfig.*?.json'],
      },
    },
  },
];
