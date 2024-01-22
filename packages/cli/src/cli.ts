#!/usr/bin/env node
'use strict';

import {configParser} from './lib/boot-cli.js'
import { runCli } from './lib/core/yargs/index.js';
import { commands } from './lib/commands/commands.js';

runCli({
  commands: commands,
  configParser
});
