import { defineConfig, Options } from 'tsup';

const commonConfig: Options = {
  minify: true,
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
};
export default defineConfig([
  {
    ...commonConfig,
    entry: ['src/index.ts'],
    outDir: 'dist',
  },
  {
    ...commonConfig,
    entry: ['src/headless/index.ts'],
    outDir: 'headless',
  },
]);
