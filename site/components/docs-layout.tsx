import * as React from 'react';
import { Toaster } from 'react-hot-toast';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { Footer } from './sections/footer';
import Logo from '../assets/logo-small.svg';

const TableItem: React.FC<{
  href: string;
  children?: React.ReactNode;
}> = ({ children, href }) => (
  <Link href={href}>
    <a className="rounded px-3 py-1.5 transition-colors duration-200 relative block hover:text-toast-500 text-toast-700">
      {children}
    </a>
  </Link>
);

const TableHeader: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => (
  <span className="px-3 mt-3 mb-1 text-sm font-semibold tracking-wide text-toast-900 uppercase">
    {children}
  </span>
);

export default function DocsLayout({ meta, children }) {
  return (
    <div className="bg-toast-50 bg-opacity-50 min-h-screen flex flex-col">
      <NextSeo
        titleTemplate="%s - react-hot-toast"
        title={meta.title}
        openGraph={{
          images: [
            {
              url: `https://react-hot-toast.com/social-image.png`,
              width: 1200,
              height: 630,
            },
          ],
        }}
      />

      <div className="flex-1 mx-auto px-2 max-w-4xl w-full">
        <header className=" col-start-1 col-end-6 mt-12 mb-16 px-2 flex justify-between items-center">
          <Link href="/">
            <Logo
              className="cursor-pointer"
              aria-label="react-hot-toast Logo"
            />
          </Link>
          <a
            className="flex text-toast-600 underline"
            href="https://github.com/timolins/react-hot-toast"
          >
            GitHub
          </a>
        </header>

        <div className="md:flex md:space-x-4">
          <nav className="font-medium rounded-lg ">
            <div className="flex flex-col mb-8 sticky top-0">
              <TableHeader>Overview</TableHeader>

              <TableItem href="/docs">Get Started</TableItem>

              <TableHeader>API</TableHeader>

              <TableItem href="/docs/toast">toast()</TableItem>
              <TableItem href="/docs/toaster">{`Toaster`}</TableItem>
              <TableItem href="/docs/toast-bar">{`ToastBar`}</TableItem>
              <TableItem href="/docs/use-toaster">useToaster()</TableItem>
              <TableItem href="/docs/use-toaster-store">
                useToasterStore()
              </TableItem>
              <TableHeader>Guides</TableHeader>
              <TableItem href="/docs/styling">Styling</TableItem>
              <TableHeader>Releases</TableHeader>
              <TableItem href="/docs/version-2">New in 2.0</TableItem>
            </div>
          </nav>

          <main className="col-span-4 w-full prose prose-toast text-toast-900 flex-1">
            {children}
          </main>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
