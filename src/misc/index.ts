import { statSync } from 'fs';
import { sizer } from './sizer';
import { getAllFiles } from './utils';

const statSizes = () => {
  console.time('查找所有文件');
  const files = getAllFiles('/home/aldia', new Set(['node_modules']));
  console.timeEnd('查找所有文件');
  console.log(`文件数量: ${files.length}`);
  console.time('遍历一遍stat');
  for (let i = 0; i < files.length; i++) {
    const s = statSync(files[i]);
  }
  console.timeEnd('遍历一遍stat');
  console.time('遍历一遍统计size');
  for (let i = 0; i < files.length; i++) {
    const s = statSync(files[i]);
    sizer.classify(s.size);
  }
  console.timeEnd('遍历一遍统计size');
  console.log(sizer.sizeCountTable);
};
// statSizes();

export * from './format-table';
export * from './utils';
export * from './sizer';
