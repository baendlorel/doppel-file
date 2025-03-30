import * as fs from 'fs';
import path from 'path';
import { sizer } from './misc';

const getAllFiles = (root: string) => {
  const files: string[] = [];
  const walkDir = (dir: string) => {
    try {
      const list = fs.readdirSync(dir);
      for (let i = 0; i < list.length; i++) {
        if (list[i] === 'node_modules') {
          continue;
        }
        const filePath = path.join(dir, list[i]);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else {
          files.push(filePath);
          sizer.classify(stat.size);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(`\e[31m${error.name} ${error.message}\e[0m`);
      } else {
        console.log(`\e[31merror\e[0m`, error);
      }
    }
  };
  walkDir(root);
  return files.length;
};

console.time('统计数量');
console.log(getAllFiles('D:\\'));
console.timeEnd('统计数量');
fs.writeFileSync('sizeCount.txt', sizer.sizeCountTable);
