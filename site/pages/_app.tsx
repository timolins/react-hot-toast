import '../styles/main.css';
import '../styles/tailwind-utils.css';
import * as React from 'react';
import Head from 'next/head';

import { MDXProvider } from '@mdx-js/react';
import { Code } from '../components/code';

const components = {
  inlineCode: (props) => (
    <code className="bg-toast-300 py-1 my-0.5 px-1 rounded" {...props} />
  ),
  code: (props) => <Code snippet={props.children} />,
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script async data-api="/_hive" src="/bee.js"></script>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <MDXProvider components={components}>
        <Component {...pageProps} />
      </MDXProvider>
    </>
  );
}

export default MyApp;
