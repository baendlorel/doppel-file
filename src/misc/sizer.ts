import { formatRightAlignedTable, formatTable } from './format-table';

const formatBytes = (bytes: number, decimals = 0): string => {
  const K = 1000;
  if (bytes < 0) {
    throw new Error('Byte size cannot be negative');
  }

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  if (bytes === 0) {
    return '0B';
  }

  const i = Math.floor(Math.log10(bytes) / 3);
  const formattedSize = (bytes / Math.pow(K, i)).toFixed(decimals);

  return `${formattedSize}${sizes[i]}`;
};

export const sizer = (() => {
  const L = 11;
  const INDEX = Array.from({ length: L }, (_, i) => i);
  const SIZES = Array.from({ length: L }, (_, i) => 10 ** i);
  const sizeCount = Array.from({ length: L + 1 }, () => 0);
  return {
    classify: (size: number) => {
      for (let i = 0; i < SIZES.length; i++) {
        if (size < SIZES[i]) {
          sizeCount[i]++;
          return;
        }
      }
      sizeCount[SIZES.length]++;
    },
    get sizeCountTable() {
      return formatTable([INDEX, SIZES.map((v) => formatBytes(v)), sizeCount]);
    },
  };
})();
