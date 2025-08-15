import type { Plugin } from 'esbuild';

// CSS-specific minification for template literals
function minifyCSS(css: string): string {
  // return css;
  return (
    css
      // Remove all unnecessary whitespace
      .replace(/\s+/g, ' ')
      // Remove space around colons
      .replace(/\s*:\s*/g, ':')
      // Remove space around semicolons
      .replace(/\s*;\s*/g, ';')
      // Remove space around commas
      .replace(/\s*,\s*/g, ',')
      // Decimal optimization: 0.X → .X
      .replace(/\b0(\.\d+)/g, '$1')

      // Unit removal for zero values
      .replace(/\b0(px|em|rem|%|deg|s|ms|vh|vw|vmin|vmax)\b/g, '0')

      // Color optimizations
      .replace(/rgba\((\d+),(\d+),(\d+),0(\.\d+)\)/g, 'rgba($1,$2,$3,$4)') // Remove leading zero in alpha
      .replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3') // #aabbcc → #abc

      // Optimize empty content property
      .replace(/content\s*:\s*['"]['"];/g, 'content:"";')

      // Remove leading/trailing spaces
      .trim()
  );
}

export const cssMinifierPlugin = (): Plugin => ({
  name: 'css-minifier',
  setup(build) {
    if (build.initialOptions.write !== false) return;

    build.onEnd((result) => {
      result.outputFiles?.forEach((file, fileIndex, outputFiles) => {
        if (!/\.[mc]?js$/.test(file.path)) return;

        const content = new TextDecoder().decode(file.contents);

        // Find and minify CSS in template literals more aggressively
        const minified = content.replace(
          /`([^`]*(?:from|to|%|\{[^}]*\})[^`]*)`/g,
          (match, cssContent) => {
            // Only process if it looks like CSS (contains CSS keywords)
            if (
              /(?:transform|opacity|width|height|background|animation|from|to|%|\{)/.test(
                cssContent
              )
            ) {
              return '`' + minifyCSS(cssContent) + '`';
            }
            return match;
          }
        );

        outputFiles[fileIndex].contents = new TextEncoder().encode(minified);
      });
    });
  },
});
