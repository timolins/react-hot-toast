import React from 'react';
import Link from 'next/link';

export function Footer({ noBadge }: { noBadge?: boolean }) {
  return (
    <footer className="container relative justify-center my-8 flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <a
          className="underline"
          target={"_blank"}
          rel={"noopener noreferrer"}
          href="https://github.com/timolins/react-hot-toast?utm_source=react-hot-toast&utm_medium=referral&utm_campaign=footer"
        >
          GitHub
        </a>
        <Link href="/docs">
          <a className="underline">Docs</a>
        </Link>
        <a className="underline" rel={"noopener noreferrer"} target={"_blank"} href="https://x.com/timolins?utm_source=react-hot-toast&utm_medium=referral&utm_campaign=footer">
          X (formerly Twitter)
        </a>
      </div>
      <div className="text-toast-600">
        <span>© {new Date().getFullYear()} react-hot-toast</span>
        {' · '}
        <span>
          <span>Built by </span>
          <a className="underline" rel={"noopener noreferrer"} target={"_blank"} href="https://timo.sh?utm_source=react-hot-toast&utm_medium=referral&utm_campaign=footer">
            Timo Lins
          </a>
        </span>
      </div>
    </footer>
  );
}
