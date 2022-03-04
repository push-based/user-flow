import { prompt } from 'enquirer';
import { CrawlConfig } from '../../models';
import { DEPRECATIONS_OUTPUT_DIRECTORY } from '../../constants';
import { getInteractive } from '../../utils';

export async function ensureOutputDirectory(
  config: CrawlConfig
): Promise<CrawlConfig> {
  let outputDirectorySuggestion =
    config.outputDirectory || DEPRECATIONS_OUTPUT_DIRECTORY;
  if (getInteractive()) {
    const { outputDirectory }: CrawlConfig = await prompt([
      {
        type: 'input',
        name: 'outputDirectory',
        message: "What's the output directory?",
        initial: outputDirectorySuggestion,
        skip: !!config.outputDirectory,
      },
    ]);
    outputDirectorySuggestion = outputDirectory;
  }

  return {
    ...config,
    outputDirectory: outputDirectorySuggestion,
  };
}
