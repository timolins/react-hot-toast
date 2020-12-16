// import 'prismjs/components/';
import '../styles/main.css';
import '../styles/prism-theme.css';
import '../styles/tailwind-utils.css';
import * as React from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script async data-api="/_hive" src="/bee.js"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
