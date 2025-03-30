// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs', // 输出格式：'esm'、'cjs'、'iife'、'umd' 等
    sourcemap: true,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }), // 使用 TypeScript 插件
  ],
};
