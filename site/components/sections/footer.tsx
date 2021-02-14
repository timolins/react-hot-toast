import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="container relative justify-center my-8 flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
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
      </div>
      <div className="text-toast-600">
        <span>© 2020 react-hot-toast</span>
        {' · '}
        <span>
          <span>Built by </span>
          <a className="underline" href="https://timo.sh">
            Timo Lins
          </a>
        </span>
      </div>
      <div>
        <a href="https://splitbee.io">
          <img
            src="https://splitbee-cdn.fra1.cdn.digitaloceanspaces.com/static/badge/splitbee-badge.svg"
            alt="Analytics by Splitbee.io"
          />
        </a>
      </div>
    </footer>
  );
}
