import { parse } from 'path';
import { getAllFiles, sizer } from '../src/misc';
const sizeCountMethod = () => {
  const sizeClassify2 = (size: number) => {
    const index = Math.floor(Math.log10(size));
    return index > 8 ? 9 : index;
  };

  const tester = Array.from({ length: 10 ** 8 }, () => Math.random() * 10 ** 8);
  const sizeCount2 = Array.from({ length: 10 }, () => 0);

  console.time('比大小');
  for (let i = 0; i < tester.length; i++) {
    const index = sizer.classify(tester[i]);
  }
  console.timeEnd('比大小');

  console.time('对数法');
  for (let i = 0; i < tester.length; i++) {
    const index = sizeClassify2(tester[i]);
    sizeCount2[index]++;
  }
  console.timeEnd('对数法');

  console.table([sizer.sizeCountTable, sizeCount2]);
};

// Date.now() 和 performance.now() 的获取时间差不多
const testTimeGetter = () => {
  const TOTAL = 10000000;
  console.time('date now');
  for (let i = 0; i < TOTAL; i++) {
    const time = Date.now();
  }
  console.timeEnd('date now');
  console.time('performance now');
  for (let i = 0; i < TOTAL; i++) {
    const time = performance.now();
  }
  console.timeEnd('performance now');
};

// 对路径使用parse来提取后缀名，和用正则提取后缀名耗时差不多，50万个路径只差了10-25ms
const testsuffixgetter = () => {
  const EXCLUDE = new Set([
    'mnt',
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
  ]);

  console.time('prepare');
  let files = getAllFiles('/home', EXCLUDE);
  files = files.concat(files);
  files = files.concat(files);
  files = files.concat(files);
  files = files.concat(files);
  files = files.concat(files);
  console.timeEnd('prepare');
  console.log(`total file count:${files.length}`);
  console.time('path.parse');
  const setparse = new Set<string>();
  for (let i = 0; i < files.length; i++) {
    const element = parse(files[i]).ext;
    setparse.add(element);
  }
  console.timeEnd('path.parse');
  console.time('regex');
  const setregex = new Set<string>();
  for (let i = 0; i < files.length; i++) {
    const element = files[i].match(/\.[\w-]+$/)?.[0] ?? '.';
    setregex.add(element);
  }
  console.timeEnd('regex');

  const areSetsEqual = function <T>(setA: Set<T>, setB: Set<T>): boolean {
    if (setA.size !== setB.size) return false;
    for (const item of setA) {
      if (!setB.has(item)) return false;
    }
    return true;
  };
  console.log('areSetsEqual' + areSetsEqual(setregex, setparse));

  const reghasparsenot = [] as string[];
  for (const suffix of setregex) {
    if (!setparse.has(suffix)) {
      reghasparsenot.push(suffix);
    }
  }
  console.log('reghasparsenot', reghasparsenot);

  const parsehasregnot = [] as string[];
  for (const suffix of setparse) {
    if (!setregex.has(suffix)) {
      parsehasregnot.push(suffix);
    }
  }
  console.log('parsehasregnot', parsehasregnot);
};
