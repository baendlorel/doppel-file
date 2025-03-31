import fs from 'fs';
import { formatNum, getAllFiles } from './misc';

const main = () => {
  /** 最小文件大小，超过这个值再开始对比是否相同 */
  const MIN_SIZE = 1000;

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

  // 看一下前几名数量最多的是谁
  const sizes = [...sizeMap];
  sizes.sort((a, b) => b[1].length - a[1].length);
  console.table(sizes.slice(0, 20).map((v) => ({ size: v[0], count: v[1].length })));

  // 开始处理，小于1KB的文件忽略，只有一个的文件忽略
  let c = 0;
  let calculateTime = 0;
  for (const [size, list] of sizeMap) {
    if (size < MIN_SIZE || list.length <= 1) {
      continue;
    }
    // 这里开始处理
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const s = fs.statSync(file);
    }
    c++;
    calculateTime += list.length ** 2;
  }
  console.log(`total files: ${formatNum(files.length)}`);
  console.log(`>1KB and length>1 groups: ${formatNum(c)}`);
  console.log(`total groups:${formatNum(sizeMap.size)}`);
  console.log(`calculateTime: ${formatNum(calculateTime)}`);
  console.log(`brute force calculate time: ${formatNum(files.length ** 2)}`);
  console.log(
    `calculatime saved: ${((1 - calculateTime / files.length ** 2) * 100).toFixed(3)}%`
  );
};
main();
