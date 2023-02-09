import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const path = 'packages/user-flow-ci-integration/measures';
const reportJsonPath = readdirSync(path)[0];
if (!reportJsonPath) {
  throw new Error('Report file not found');
}
const dest = join(path, reportJsonPath);
writeFileSync('md-report.md', dest, { encoding: 'utf8' });
console.log(`Report ${join(path, reportJsonPath)} renamed to 'md-report.md'`);
