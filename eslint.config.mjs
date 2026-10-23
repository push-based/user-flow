import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginImport from 'eslint-plugin-import';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist', 'packages/cli/docs/**'],
  },
  js.configs.recommended,
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ),
  {
    plugins: {
      '@nx': nxEslintPlugin,
      '@typescript-eslint': typescriptEslintEslintPlugin,
      import: eslintPluginImport,
    },
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: 'tsconfig.base.json',
        },
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      'prefer-const': 'warn',
      'no-useless-escape': 'warn',
      'import/default': 'warn',
      'import/no-named-as-default-member': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
    languageOptions: {
      parser: await import('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
  },
  ...compat
    .config({
      env: {
        node: true,
        es2022: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
      rules: {
        ...config.rules,
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
        },
      },
    })),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.unit.test.ts',
      '**/*.mock.ts',
      '**/*.e2e.test.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: [
      '**/*.json',
      '**/*.css',
      '**/*.html',
      '**/*.ico',
      '.gitkeep',
      '.babelrc',
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.config.mts',
      'vite.config.mts',
      'webpack.config.js',
    ],
  },
];
