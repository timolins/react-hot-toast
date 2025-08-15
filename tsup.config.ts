import { defineConfig, Options } from 'tsup';
import { minifyTemplates, writeFiles } from 'esbuild-minify-templates';
import { cssMinifierPlugin } from './build-plugins/css-minifier';

const commonConfig: Options = {
  minify: true,
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  write: false,
  esbuildPlugins: [
    minifyTemplates({ taggedOnly: false }),
    cssMinifierPlugin(),
    writeFiles(),
  ],
};
export default defineConfig([
  {
    ...commonConfig,
    esbuildOptions: (options) => {
      // Append "use client" to the top of the react entry point
      options.banner = {
        js: '"use client";',
      };
    },
    entry: ['src/index.ts'],
    outDir: 'dist',
  },
  {
    ...commonConfig,
    entry: ['src/headless/index.ts'],
    outDir: 'headless',
  },
]);
