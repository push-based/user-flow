#!/usr/bin/env node
'use strict';


import {configParser} from './lib/boot-cli.js'
import { runCli } from './lib/core/yargs/index.js';
import { commands } from './lib/commands/commands.js';
import { GLOBAL_OPTIONS_YARGS_CFG } from './lib/global/options/index.js';

console.log('Runs')

runCli({
  commands: commands,
  options: {...GLOBAL_OPTIONS_YARGS_CFG},
  configParser
});
