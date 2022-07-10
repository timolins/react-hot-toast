import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import nextMdx from '@next/mdx';
import withPlugins from 'next-compose-plugins';

const withMDX = nextMdx({
  extension: /.mdx?$/,
  options: {
    rehypePlugins: [rehypeSlug],
    remarkPlugins: [remarkGfm],
    providerImportSource: '@mdx-js/react',
  },
});

const withSvgr = (nextConfig = {}, nextComposePlugins = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: /.svg$/,
        use: ['@svgr/webpack'],
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

export default withPlugins(
  [
    withMDX({
      pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    }),
    withSvgr,
  ],
  {
    async rewrites() {
      return [
        {
          source: '/bee.js',
          destination: 'https://cdn.splitbee.io/sb.js',
        },
        {
          source: '/_hive/:slug',
          destination: 'https://hive.splitbee.io/:slug',
        },
      ];
    },
  }
);
