import { readdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { readFile } from '../dist/packages/cli/src/lib/core/file';

console.log(`Reame results for comment action`);
const path = 'packages/user-flow-ci-integration/measures';
const reportPath = readdirSync(path)[0];
if (!reportPath) {
  throw new Error('Report file not found');
}
const targetPath = join(path, reportPath);
const destPath = join(path, 'md-report.md');
writeFileSync(destPath, readFileSync(targetPath, {encoding: 'utf8'}));
console.log(`Report ${targetPath} renamed to ${destPath}`);
