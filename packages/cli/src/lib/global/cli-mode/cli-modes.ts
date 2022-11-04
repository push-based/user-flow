import { logVerbose } from '../../core/loggin';
import { CLI_MODES } from './types';

/**
 * Motivation and Concepts of CLI Modes
 *
 * The CLI can execute in different environments:
 * - As actual CLI used in the console. e.g. used by a developer to repetitively test a page
 * - In the test setup to ensure functionality. e.g. in it's repository's test code
 * - On the server of a application. e.g. https://lighthouse-metrics.com/
 * - In the CI of a code versioning service. e.g. GitHub
 *
 * Used as is, the CLI is designed to have good DX, developer experience and lean setup costs.
 * A couple of examples for good DX are prompts, file generation, visualizing data, reporting progress etc.
 *
 * This obviously leads to a default configuration which is beneficial for one environment or usage but,
 * but not for many others. As an example a automatic prompt is helpful for a human that forgot to configure a specific setting,
 * but in a CI setup it should fail with an error requesting the missing setting.
 *
 * To work around it we have to adopt the configuration of the CLI depending on the environment.
 * e.g. don't open a report automatically if it runs in the CI `--open false` or `-e false`.
 *
 * As an example let's look at the CLI configuration if we execute it in the CI with default settings:
 *
 * `npx user-flow -i false -e false -f json -f md -f html`
 *
 * Here the explanation why we use all the parameters:
 * - `--open false` (`-e`) - No one will look at it in the CI
 * - `--interactive false` (`-i`) - No one can answer
 * - `--format json --format md` (`-f`) - Because we need it for the GitHub action as md text and json
 * - `--format html` - We need to maintain the original formats too
 * - __headless__ - we need to configure the lighthouse for a headless run
 *
 * With different test sets the above gets hard to maintain.
 *
 * This is where the CLI mode feature can help. It detects the current environment and provides it for other parts of the CLI.
 * We can use it to implement environment based default configurations to improve DX and reduce the maintenance costs.
 *
 * The above command can with a pre-configuration would look like this:
 *
 * `npx user-flow`
 *
 */

const env: any = process.env;

const CI_PROPERTY = 'CI';
const CLI_MODE_PROPERTY = Symbol('__CLI_MODE__');

/**
 *
 */
export function getCliMode(): CLI_MODES {
  // lazy setup
  if(!env[CLI_MODE_PROPERTY]) {
    env[CLI_MODE_PROPERTY] = detectCliMode();
  }
  return env[CLI_MODE_PROPERTY];
}

function detectCliMode(): CLI_MODES {
  return isEnvCi() ?  'CI' : isEnvSandbox() ? 'SANDBOX' : 'DEFAULT';
}

/**
 * If the CLI is under test the user has to set the env property `CI_PROPERTY` to 'SANDBOX' programmatically to enable the sandbox mode.
 * This function is here to check this.
 */
export function isEnvSandbox(): boolean {
  return env[CI_PROPERTY] === 'SANDBOX';
}

/**
 * Determines if the CLI is running in a CI setup
 */
export function isEnvCi(): boolean {

  /*
  Detailed links: https://github.com/push-based/user-flow/issues/15

  The following platforms have a CI key:
    CI=true - github

    CI=true - circleci

    CI=true - gitlab

    - travis
    CI=true
    CONTINUOUS_INTEGRATION=true

    CI=true - netlify

    - cirrus
    CI=true
    CONTINUOUS_INTEGRATION=true

    CI=true - appveyor

    CI=true - codeShip

    - dsari
    env.RUN_ID=??
    CI=true

    - taskCluster
    env.RUN_ID=??

    CI=1 - vercel

    - jenkins
    BUILD_NUMBER=??

    - teamCity
    BUILD_NUMBER=??

    Unknown:

    ??? - Azure Pipelines
   */

  const ciValue: string | undefined =
    env[CI_PROPERTY] || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
    env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
    env.BUILD_NUMBER || // Jenkins, TeamCity
    env.RUN_ID; // TaskCluster, dsari

  return ciValue != null && ciValue+'' !== 'SANDBOX';
}
