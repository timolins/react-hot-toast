import type { Plugin } from 'esbuild';
import { readFile } from 'fs/promises';

function minifyCssChunk(css: string): string {
  const parts = css.split(/(\$\{[^}]+\})/g);

  return parts
    .map((part) => {
      if (part.startsWith('${')) {
        return part;
      }

      return part
        .replace(/[\n\r\t]+/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        .replace(/:\s*0(px|em|rem|pt|ch|ex|vh|vw|vmin|vmax|%)/gi, ':0')
        .replace(/;\s*}/g, '}')
        .replace(/\s*{\s*/g, '{');
    })
    .join('');
}

export function minifyCssLiterals(): Plugin {
  return {
    name: 'minify-css-literals',
    setup(build) {
      build.onLoad({ filter: /\.[jt]sx?$/ }, async (args) => {
        const contents = await readFile(args.path, 'utf8');
        let changed = false;

        const updated = contents.replace(
          /`([^`]*\{[^`]*)`/g,
          (full, css: string) => {
            const minified = minifyCssChunk(css);
            if (minified === css) {
              return full;
            }
            changed = true;
            return `\`${minified}\``;
          }
        );

        if (!changed) {
          return null;
        }

        const loader = args.path.endsWith('.tsx')
          ? 'tsx'
          : args.path.endsWith('.jsx')
          ? 'jsx'
          : 'ts';

        return { contents: updated, loader };
      });
    },
  };
}
