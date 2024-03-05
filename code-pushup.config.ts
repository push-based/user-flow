import eslintPlugin, { eslintConfigFromNxProjects } from '@code-pushup/eslint-plugin';
import type { CoreConfig } from '@code-pushup/models';
import 'dotenv/config';

const config: CoreConfig = {
  upload: {
    server: 'https://portal-api-r6nh2xm7mq-ez.a.run.app/graphql',
    apiKey: process.env.CP_API_KEY,
    organization: 'push-based',
    project: 'user-flow',
  },
  plugins: [
    await eslintPlugin(await eslintConfigFromNxProjects()),
  ],
  categories: [
    {
      slug: 'bug-prevention',
      title: 'Bug prevention',
      refs: [
        {
          type: 'audit',
          plugin: 'eslint',
          slug: 'no-var',
          weight: 1,
        },
        {
          type: 'audit',
          plugin: 'eslint',
          slug: 'prefer-const',
          weight: 1,
        },
        {
          type: 'group',
          plugin: 'eslint',
          slug: 'problems',
          weight: 100
        },
      ],
    },
    {
      slug: 'code-style',
      title: 'Code style',
      refs: [
        {
          type: 'group',
          plugin: 'eslint',
          slug: 'suggestions',
          weight: 75
        },
        {
          type: 'group',
          plugin: 'eslint',
          slug: 'formatting',
          weight: 25
        },
      ],
    },
  ],
};

export default config;
