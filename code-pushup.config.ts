import eslintPlugin, { eslintConfigFromNxProjects } from '@code-pushup/eslint-plugin';
import type { CoreConfig } from '@code-pushup/models';
import 'dotenv/config';

const config: CoreConfig = {
  upload: {
    server: process.env.CP_SERVER,
    apiKey: process.env.CP_API_KEY,
    organization: process.env.CP_ORGANIZATION,
    project: process.env.CP_PROJECT,
  },
  plugins: [
    await eslintPlugin(await eslintConfigFromNxProjects()),
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
