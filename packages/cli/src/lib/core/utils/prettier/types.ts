import { BuiltInParserName } from 'prettier';

export type SupportedParser = Extract<BuiltInParserName, 'css' | 'html' | 'json' | 'less' | 'scss' | 'markdown' | 'typescript'>;
type SupportedParserNotExtname = Extract<SupportedParser, 'markdown' | 'typescript'>;

export type SupportedExtname = Exclude<SupportedParser, SupportedParserNotExtname> | 'md' | 'ts' | 'js';
