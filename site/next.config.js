const withTM = require('next-transpile-modules')(['react-hot-toast']);
const remarkSlugs = require('rehype-slug');

const withMDX = require('@next/mdx')({
  extension: /.mdx?$/,
  options: {
    rehypePlugins: [remarkSlugs],
  },
});
const withPlugins = require('next-compose-plugins');

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

module.exports = withPlugins(
  [
    withMDX({
      pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    }),
    withTM,
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
