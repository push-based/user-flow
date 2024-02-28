import eslintPlugin, { eslintConfigFromNxProject } from '@code-pushup/eslint-plugin';
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
    await eslintPlugin(await eslintConfigFromNxProject('cli')),
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
