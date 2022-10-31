import { logVerbose } from './core/utils/loggin';

export type CLI_MODES = 'DEFAULT' | 'CI' | 'SANDBOX';
const env: any = process.env;

/**
 * CLI_MODE_PROPERTY can have the following values "DEFAULT" | "CI" | "SANDBOX"
 */
export const CI_PROPERTY = 'CI';
export const CLI_MODE_PROPERTY = '__CI_MODE__';

export function detectCliMode(): CLI_MODES {
  const CLI_MODE: CLI_MODES = env[CLI_MODE_PROPERTY] as unknown as CLI_MODES;
  logVerbose('CLI_MODE:', CLI_MODE);
  return CLI_MODE;
}


export function detectCi(): string {

  /*
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

  const CI_TYPE: string = (
    env[CI_PROPERTY] || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
    env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
    env.BUILD_NUMBER || // Jenkins, TeamCity
    env.RUN_ID || // TaskCluster, dsari
    exports.name ||
    (
      env[CLI_MODE_PROPERTY] === 'SANDBOX' ? 'SANDBOX' // SANDBOX => In testing mode
        : 'DEFAULT'
    )
  );

  logVerbose('CI_TYPE: ', CI_TYPE);
  return CI_TYPE;
}
