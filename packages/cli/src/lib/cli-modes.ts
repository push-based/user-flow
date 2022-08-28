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
