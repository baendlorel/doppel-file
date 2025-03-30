import fs from 'fs';
import path from 'path';

export const getAllFiles = (root: string, exclude: Set<string>) => {
  const files: string[] = [];
  const _scanDir = (dir: string) => {
    try {
      const list = fs.readdirSync(dir);
      for (let i = 0; i < list.length; i++) {
        if (exclude.has(list[i])) {
          continue;
        }
        const filePath = path.join(dir, list[i]);
        if (fs.statSync(filePath).isDirectory()) {
          _scanDir(filePath);
        } else {
          files.push(filePath);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(`\x1b[31m${error.name} ${error.message}\x1b[0m`);
      } else {
        console.log(`\x1b[31merror\x1b[0m`, error);
      }
    }
  };
  _scanDir(root);
  return files;
};
