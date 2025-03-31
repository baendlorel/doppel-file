import { statSync, writeFileSync } from 'fs';
import { clearHashCache, formatBytes, formatNum, getAllFiles, getHash } from './misc';
import { parse } from 'path';

const main = (dirs: string[], excludes?: string[]) => {
  /** 最小文件大小，超过这个值再开始对比是否相同 */
  const MIN_SIZE = 10000;
  const EXCLUDE = new Set(
    excludes ?? [
      'node_modules',
      'package-lock.json',
      'dist',
      'out',
      '.local',
      '.idea',
      '.prettierrc',
      '.eslintrc',
      '.eslintignore',
      '.gitignore',
      '.npmignore',
      '.dockerignore',
      '.docker',
      '.rustup',
      '.vscode',
      '.vscode-server',
      '.git',
      '.pyenv',
      '.nvm',
      '.cargo',
      '.git',
      '.svn',
      '.hg',
      '.bzr',
      'node_modules',
      '.pnp',
      '.yarn',
      '.npm',
      '.nvm',
      '.pyenv',
      'venv',
      '.mypy_cache',
      '__pycache__',
      'target',
      'build',
      'dist',
      '.gradle',
      '.idea',
      '.vscode',
      '.DS_Store',
      'Thumbs.db',
      'package-lock.json',
      'pnpm-lock.yaml',
      'yarn.lock',
      'composer.lock',
      'Pipfile.lock',
      'poetry.lock',
      'Cargo.lock',
      'Gemfile.lock',
      'go.sum',
      '.log',
      'npm-debug.log',
      'yarn-error.log',
      '.eslintcache',
      '.pid',
      '.swp',
      '.swo',
      '.coverage',
      '.orig',
      '.trash',
      '.o',
      '.obj',
      '.exe',
      '.dll',
      '.so',
      '.a',
      '.class',
      '.jar',
      '.war',
      '.pyc',
      '.pyo',
      '.whl',
      '.dylib',
      '.out',
      '.map',
      '.lock',
      '.next',
      '.nuxt',
      '.vercel',
      '.firebase',
      '.expo',
      '.dropbox',
      '.syncthing',
      '.AppleDouble',
      '.Spotlight-V100',
      '.Trashes',
      '~$',
    ]
  );

  console.time('查找所有文件');
  const files = dirs.reduce((prev, cur) => getAllFiles(cur, EXCLUDE).concat(prev), []);
  console.timeEnd('查找所有文件');
  console.time('构建文件大小映射');
  const sizeSuffixMap = new Map<number, Map<string, string[]>>();
  let totalFileCount = 0;
  for (let i = 0; i < files.length; i++) {
    const s = statSync(files[i]);
    // 跳过太小的文件
    if (s.size < MIN_SIZE) {
      continue;
    }
    totalFileCount++;

    const suffixMap = sizeSuffixMap.get(s.size);
    const parsed = parse(files[i]);
    if (suffixMap) {
      const suffixList = suffixMap.get(parsed.ext);
      if (suffixList) {
        suffixList.push(files[i]);
      } else {
        suffixMap.set(parsed.ext, [files[i]]);
      }
    } else {
      const newSuffixMap = new Map<string, string[]>();
      newSuffixMap.set(parsed.ext, [files[i]]);
      sizeSuffixMap.set(s.size, newSuffixMap);
    }
  }
  console.timeEnd('构建文件大小映射');
  console.log(`大于${formatBytes(MIN_SIZE)}的文件数量: ${formatNum(totalFileCount)}`);
  console.log(`根据文件大小分组组数: ${formatNum(sizeSuffixMap.size)}`);

  // 看一下前几名数量最多的是谁
  // const sizes = [...sizeMap];
  // sizes.sort((a, b) => b[1].length - a[1].length);
  // console.table(sizes.slice(0, 20).map((v) => ({ size: v[0], count: v[1].length })));

  // 统计一下总共要对比多少次

  let calculationCount = 0;
  for (const [size, suffixMap] of sizeSuffixMap) {
    for (const [suffix, list] of suffixMap) {
      if (list.length <= 1) {
        continue;
      }
      calculationCount += (list.length * (list.length - 1)) / 2;
    }
  }
  console.log(`预计总共要对比的次数 : ${formatNum(calculationCount)}`);
  console.log('开始对比', `现在是${new Date().toLocaleString()}`);

  console.time('全套对比');
  const cc1000 = Math.round(calculationCount / 1000);
  let counter = 0;
  const hashMap = new Map<string, Set<string>>();
  // 开始处理，小于1KB的文件忽略，只有一个的文件忽略
  for (const [size, suffixMap] of sizeSuffixMap) {
    for (const [suffix, list] of suffixMap) {
      if (list.length <= 1) {
        continue;
      }

      // 一定要计算hash，因为可能有多个文件互相相同，最后要按照hash值分类的
      // 这里开始处理
      clearHashCache();
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          counter++;
          if (counter % cc1000 === 0) {
            console.timeLog(
              '全套对比',
              `现在是${counter}次 ${new Date().toLocaleString()}`
            );
          }
          const h1 = getHash(list[i]);
          const h2 = getHash(list[j]);
          if (h1 === h2) {
            const hlist = hashMap.get(h1);
            if (hlist) {
              hlist.add(list[i]);
              hlist.add(list[j]);
            } else {
              hashMap.set(h1, new Set([list[i], list[j]]));
            }
          }
        }
      }
    }
  }
  console.timeEnd('全套对比');
  console.log(`total hash groups: ${hashMap.size}`);

  console.time('记录文件');
  let content = '';
  let index = 0;
  for (const [hash, list] of hashMap) {
    index++;
    content += `${index}. ${hash}\n`;
    for (const filePath of list) {
      content += '\t' + filePath + '\n';
    }
  }
  content = `总共有${index}组相同文件\n` + content;
  console.log(`重复文件地址写入 duplicate.txt`);
  writeFileSync('duplicate.txt', content);
  console.timeEnd('记录文件');
  const bytes = formatBytes(statSync('duplicate.txt').size);
  console.log(`duplicate.txt 文件大小: ${bytes}`);
};
// main(['/home/aldia']);
main(['C:\\', 'D:\\', 'E:\\', 'F:\\']);
