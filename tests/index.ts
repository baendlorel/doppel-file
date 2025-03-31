import { sizer } from '../src/misc';
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
testTimeGetter();
