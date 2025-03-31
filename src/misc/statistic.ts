import fs from 'fs';
import { formatNum, getAllFiles } from './utils';

const main = () => {
  /** 最小文件大小，超过这个值再开始对比是否相同 */
  const MIN_SIZE = 1000;
  const MIN_HASH_SIZE = 1000 * 1000;

  console.time('查找所有文件');
  const files = getAllFiles('/home/aldia', new Set(['node_modules']));
  console.timeEnd('查找所有文件');
  console.time('构建文件大小映射');
  const sizeMap = new Map<number, string[]>();
  for (let i = 0; i < files.length; i++) {
    const s = fs.statSync(files[i]);
    // 跳过太小的文件
    if (s.size < MIN_SIZE) {
      continue;
    }

    const list = sizeMap.get(s.size);
    if (list) {
      list.push(files[i]);
    } else {
      sizeMap.set(s.size, [files[i]]);
    }
  }
  console.timeEnd('构建文件大小映射');

  // 看一下前几名数量最多的是谁
  // const sizes = [...sizeMap];
  // sizes.sort((a, b) => b[1].length - a[1].length);
  // console.table(sizes.slice(0, 20).map((v) => ({ size: v[0], count: v[1].length })));

  // 开始处理，小于1KB的文件忽略，只有一个的文件忽略
  let c = 0;
  let calculateTime = 0;
  for (const [size, list] of sizeMap) {
    if (list.length <= 1) {
      continue;
    }
    if (size < MIN_HASH_SIZE)
      // 这里开始处理
      for (let i = 0; i < list.length; i++) {
        const file = list[i];
      }
    c++;
    calculateTime += list.length ** 2;
  }
  console.log(`>1KB total files: ${formatNum(files.length)}`);
  console.log(`total groups:${formatNum(sizeMap.size)}`);
  console.log(`length>1 groups: ${formatNum(c)}`);
  console.log(`calculateTime: ${formatNum(calculateTime)}`);
  console.log(`brute force calculate time: ${formatNum(files.length ** 2)}`);
  const savedPercent = (1 - calculateTime / files.length ** 2) * 100;
  console.log(`calculatime saved: ${savedPercent.toFixed(3)}%`);
};
