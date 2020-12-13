import React, { useState } from 'react';
import toast from 'react-hot-toast';
import SyntaxHighlighter from 'react-syntax-highlighter';

import { EmojiButton } from '../emoji-button';

const examples: Array<{
  title: string;
  action: () => void;
  emoji: string;
  snippet: string;
}> = [
  {
    title: 'Success',
    emoji: '✅',
    snippet: "toast.success('Successfully toasted!')",
    action: () => {
      toast.success('Successfully toasted!');
    },
  },
  {
    title: 'Error',
    emoji: '❌',
    snippet: `toast.error("This didn't work.")`,

    action: () => {
      toast.error("This didn't work.");
    },
  },
  {
    title: 'Promise',
    emoji: '⏳',
    snippet: `toast.promise(
   myPromise,
   {
     loading: 'Loading',
     success: 'Success',
     error: <b>Error</b>,
   }
 );`,
    action: () => {
      const promise = new Promise((res, rej) => {
        setTimeout(Math.random() > 0.5 ? res : rej, 1000);
      });

      const opts = {
        style: {
          width: '150px',
          paddingRight: '10px',
        },
      };

      toast.promise(
        promise,
        {
          error: <b>Error</b>,
          success: 'Success',
          loading: 'Loading',
        },
        {
          error: opts,
          loading: opts,
          success: opts,
        }
      );
    },
  },
  {
    title: 'Multi Line',
    emoji: '↕️',

    action: () => {
      toast(
        "This toast is super big. I don't think anyone could eat it in one bite. It's larger than you expected. You eat it but it does not seem to get smaller.",
        {
          icon: '↕️',
          duration: 6000,
        }
      );
    },
  },
  {
    title: 'Emoji',
    emoji: '👏',

    action: () => {
      toast('Good Job!', {
        icon: '👏',
      });
    },
  },
  {
    title: 'Dark Mode',
    emoji: '🌚',

    action: () => {
      toast(
        <span>
          Custom and <b>bold</b>
        </span>,
        {
          icon: '👏',

          style: {
            borderRadius: '200px',
            background: '#333',
            color: 'white',
          },
        }
      );
    },
  },
  {
    title: 'JSX Content',
    emoji: '🔩',

    action: () => {
      toast(
        <span>
          Custom and <b>bold</b>
          <button
            className="ml-2 py-1 rounded px-2 border bg-gray-100 text-gray-900"
            onClick={() => toast.dismiss()}
          >
            Clear All
          </button>
        </span>
      );
    },
  },
  {
    title: 'Themed',
    emoji: '🎨',

    action: () => {
      toast.success('Look I have brand styling', {
        style: {
          boxShadow: 'none',
          background: '#8C4913',
          color: 'white',
        },
        iconTheme: {
          success: {
            primary: 'white',
            secondary: '#8C4913',
          },
        },
      });
    },
  },
];

export const ToastExample = () => {
  const [snippet, setSnippet] = useState(examples[0].snippet);
  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="flex items-center">
        <div className="w-full grid grid-cols-2 gap-2">
          {examples.map((e) => (
            <EmojiButton
              emoji={e.emoji}
              onClick={() => {
                if (e.snippet) {
                  setSnippet(e.snippet);
                }
                e.action();
              }}
            >
              {e.title}
            </EmojiButton>
          ))}
        </div>
      </div>
      <div className="h-64 flex items-center">
        <SyntaxHighlighter language="jsx">{snippet}</SyntaxHighlighter>
      </div>
    </section>
  );
};
