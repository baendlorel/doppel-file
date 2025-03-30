import fs from 'fs';
import { getAllFiles } from './misc';

const main = () => {
  console.time('查找所有文件');
  const files = getAllFiles('/home/aldia', new Set(['node_modules']));
  console.timeEnd('查找所有文件');
  console.time('构建文件大小映射');
  const sizeMap = new Map<number, string[]>();
  for (let i = 0; i < files.length; i++) {
    const s = fs.statSync(files[i]);
    const list = sizeMap.get(s.size);
    if (list) {
      list.push(files[i]);
    } else {
      sizeMap.set(s.size, [files[i]]);
    }
  }
  console.timeEnd('构建文件大小映射');
  console.log(`sizeMap: ${sizeMap.size}`);

  const sizes = [...sizeMap];
  console.log(`max: ${max}   sizeOfMax:${sizeOfMax}`);
};
main();
