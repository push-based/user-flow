import eslintPlugin from '@code-pushup/eslint-plugin';
import type { CoreConfig } from '@code-pushup/models';

const config: CoreConfig = {
  // ...
  plugins: [
    // ...
    await eslintPlugin({ eslintrc: '.eslintrc.json', patterns: ['src/**/*.js'] }),
  ],
  categories: [
    {
      slug: 'bug-prevention',
      title: 'Bug prevention',
      refs: [
        { type: 'group', plugin: 'eslint', slug: 'problems', weight: 1 },
      ],
    },
    {
      slug: 'code-style',
      title: 'Code style',
      refs: [
        { type: 'group', plugin: 'eslint', slug: 'suggestions', weight: 1 },
      ],
    },
  ],
};

export default config;
