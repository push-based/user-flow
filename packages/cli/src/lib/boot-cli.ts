import { runCli } from './internal/yargs/utils';
import { commands } from './commands';
import { options } from './options';

(async () => {
  runCli({ commands: commands, options: options });
})();
