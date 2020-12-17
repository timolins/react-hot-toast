import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="container relative justify-center my-8 flex gap-8">
      <span>© 2020 react-hot-toast</span>
      <span>
        <span>Made by </span>
        <a className="underline" href="https://timo.sh">
          Timo Lins
        </a>
      </span>
      <a
        className="underline"
        href="https://github.com/timolins/react-hot-toast"
      >
        GitHub
      </a>
      <Link href="/docs">
        <a className="underline">Docs</a>
      </Link>
      <a className="underline" href="https://twitter.com/timolins">
        Twitter
      </a>
    </footer>
  );
}
