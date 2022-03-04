import { prompt } from 'enquirer';
import { CrawlConfig } from '../../models';
import { getInteractive, getSiblingPgkJson } from '../../utils';

export async function ensureDeprecationUrl(
  config: CrawlConfig
): Promise<CrawlConfig> {
  let suggestedDeprecationLink =
    config.deprecationLink || getSuggestionsFormPackageJson();

  if (getInteractive()) {
    const { deprecationLink }: CrawlConfig = await prompt([
      {
        type: 'input',
        name: 'deprecationLink',
        message: "What's the deprecation link to the docs?",
        initial: suggestedDeprecationLink,
        skip: !!config.deprecationLink,
      },
    ]);
    suggestedDeprecationLink = deprecationLink;
  }

  return {
    ...config,
    deprecationLink: suggestedDeprecationLink,
  };
}

export function getSuggestionsFormPackageJson(): string {
  const pkg = getSiblingPgkJson('./');
  let url = '';
  if (pkg.homepage) {
    url = pkg.homepage;
  } else if (pkg.repository?.url) {
    url = pkg.repository.url;
  }

  return url + '/deprecations';
}
