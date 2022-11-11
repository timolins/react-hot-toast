import '../styles/tailwind-utils.css';
import '../styles/main.css';
import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { MDXProvider } from '@mdx-js/react';
import { Code } from '../components/code';

const components = {
  a: (props) => (
    <Link href={props.href}>
      <a {...props} />
    </Link>
  ),
  code: (props) =>
    props.className ? (
      <Code className={props.className} snippet={props.children} />
    ) : (
      <code
        className="bg-toast-300 py-1 my-0.5 px-1 rounded bg-opacity-40"
        {...props}
      />
    ),
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {process.browser && (
          <script async data-no-cookie data-api="/_hive" src="/bee.js" />
        )}
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <MDXProvider components={components}>
        <Component {...pageProps} />
      </MDXProvider>
    </>
  );
}

export default MyApp;
