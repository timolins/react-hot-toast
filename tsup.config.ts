import { defineConfig, Options } from 'tsup';

const commonConfig: Options = {
  minify: true,
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : `.${format}.js`,
    };
  },
};
export default defineConfig([
  {
    ...commonConfig,
    entry: ['src/index.tsx'],
    outDir: 'dist',
  },
  {
    ...commonConfig,
    entry: ['src/headless/index.ts'],
    outDir: 'headless',
  },
]);
