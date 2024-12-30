import '../styles/tailwind-utils.css';
import '../styles/main.css';
import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';


import { MDXProvider } from '@mdx-js/react';
import { Code } from '../components/code';

const components = {
  a: (props) => (
    <Link href={props.href}>
      <a {...props} />
    </Link>
  ),
  h1: (props) => {
    const id = props.id || '';
    return (
      <h1 {...props}>
        <Link href={`#${id}`}>
          <a
            className={`!no-underline !font-extrabold !text-toast-900 *:!text-toast-900`}
          >
            {props.children}
          </a>
        </Link>
      </h1>
    );
  },
  h2: (props) => {
    const id = props.id || '';
    return (
      <h2 {...props}>
        <Link href={`#${id}`}>
          <a
            className={`!no-underline !font-semibold !text-toast-800 *:!text-toast-800`}
          >
            {props.children}
          </a>
        </Link>
      </h2>
    );
  },
  h3: (props) => {
    const id = props.id || '';
    return (
      <h3 {...props}>
        <Link href={`#${id}`}>
          <a
            className={`!no-underline !font-semibold !text-toast-800 *:!text-toast-800`}
          >
            {props.children}
          </a>
        </Link>
      </h3>
    );
  },
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
        <Analytics />
      </MDXProvider>
    </>
  );
}

export default MyApp;
