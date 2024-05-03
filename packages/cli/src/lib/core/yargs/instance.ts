import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { argv } from 'node:process';

const yargs = Yargs(hideBin(argv));

export default yargs;
