import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Footer } from './sections/footer';
import Logo from '../assets/logo-small.svg';
import { Toaster } from 'react-hot-toast';

export default function DocsLayout({ children, meta }) {
  return (
    <div className="bg-toast-50 bg-opacity-50 min-h-screen flex flex-col">
      <Head>
        <title>{meta.title} - react-hot-toast</title>
      </Head>
      <header className="container max-w-2xl my-12 flex justify-between items-center">
        <Link href="/">
          <Logo className="cursor-pointer" aria-label="react-hot-toast Logo" />
        </Link>
        <Link href="/docs">
          <a className="flex">Documentation</a>
        </Link>
      </header>
      <main className="container max-w-2xl prose prose-toast text-toast-900 flex-1">
        {children}
      </main>
      <header className="bg-gradient-to-b from-toast-50 to-white bg-opacity-10"></header>
      <Footer />
      <Toaster />
    </div>
  );
}
