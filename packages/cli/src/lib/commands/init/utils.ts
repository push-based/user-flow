import { CollectRcOptions, PersistRcOptions, ReportFormat } from '../collect/options/types.js';
import { InitOptions } from './options.js';
import { REPORT_FORMAT_VALUES } from '../collect/constants.js';

const isValidFormat = (value: any): value is ReportFormat => REPORT_FORMAT_VALUES.includes(value);

function sanitizedFormats(formats: string[]) {
  const validatedFormats: ReportFormat[] = formats.filter(isValidFormat);
  if (validatedFormats.length !== formats.length) {
    throw new Error(`${formats} contains invalid format options`);
  }
  return validatedFormats;
}

export function getInitCommandOptionsFromArgv(argv: InitOptions) {
  let {
    generateFlow, generateGhWorkflow, lhr,
    url, ufPath, serveCommand, awaitServeStdout,
    outPath, format
  } = argv;

  let collect = {} as CollectRcOptions;
  url && (collect.url = url);
  ufPath && (collect.ufPath = ufPath);
  // optional
  serveCommand && (collect.serveCommand = serveCommand);
  awaitServeStdout && (collect.awaitServeStdout = awaitServeStdout);

  let persist = {} as PersistRcOptions;
  outPath && (persist.outPath = outPath);
  format && (persist.format = sanitizedFormats(format));

  return { collect, persist, generateFlow, generateGhWorkflow, lhr };
}
