import '../styles/tailwind-utils.css';
import '../styles/main.css';
import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { MDXProvider } from '@mdx-js/react';
import { Code } from '../components/code';

const components = {
  a: Link,
  inlineCode: (props) => (
    <code
      className="bg-toast-300 py-1 my-0.5 px-1 rounded bg-opacity-40"
      {...props}
    />
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
