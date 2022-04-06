export type CLI_MODES = "DEFAULT" | "CI" | "SANDBOX";

/**
 * CLI_MODE_PROPERTY can have the following values "DEFAULT" | "CI" | "SANDBOX"
 */
export const CLI_MODE_PROPERTY = '__CLI_MODE__';
export function detectCliMode(): CLI_MODES {
  const possibleKeys = [CLI_MODE_PROPERTY, 'GITHUB_ACTION'];

  const key = possibleKeys.find(key => process.env[key] !== undefined);
  if(key !== undefined) {
    return process.env[key] as CLI_MODES;
  }
  return 'DEFAULT';
}
