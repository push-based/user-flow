import * as fs from 'fs';
import * as path from 'path';

export function getFolderContent(folders: string[]): string[] {
  return folders.flatMap((d) => {
    if (fs.existsSync(d)) {
      const files = fs.readdirSync(d);
      files.forEach((file) => path.join(d, file));
    }
    return []
  })
}

export function deleteFiles(files: string[]): void {
  files.forEach((f) => {
    if (fs.existsSync(f)) {
      fs.rmSync(filePath);
    }
  })
}
