import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { EmojiButton } from '../emoji-button';
import { Code } from '../code';

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
    snippet: 'TODO',
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
    snippet: 'TODO',
    action: () => {
      toast('Good Job!', {
        icon: '👏',
      });
    },
  },
  {
    title: 'Dark Mode',
    emoji: '🌚',
    snippet: 'TODO',
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
    snippet: 'TODO',

    action: () => {
      toast((t) => (
        <span>
          Custom and <b>bold</b>
          <button
            className="ml-2 py-1 rounded px-2 border bg-gray-100 text-gray-900"
            onClick={() => toast.dismiss(t.id)}
          >
            Remove
          </button>
        </span>
      ));
      // toast(
      //   <span>
      //     Custom and <b>bold</b>
      //   </span>
      // );
    },
  },
  {
    title: 'Themed',
    emoji: '🎨',
    snippet: 'TODO',

    action: () => {
      toast.success(
        <span>
          Look I have <b>brand styling</b>
        </span>,
        {
          style: {
            boxShadow: 'none',
            background: 'rgba(10,10,10,0.6)',
            padding: '20px 10px',
            borderRadius: '8px',
            color: 'white',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          },
          iconTheme: {
            primary: 'rgb(255,255,255,1)',
            secondary: 'rgb(10,10,10)',
          },
        }
      );
    },
  },
];

export const ToastExample = () => {
  const [snippet, setSnippet] = useState(examples[0].snippet);
  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="flex items-center">
        <div className="w-full grid grid-cols-2 gap-2 bg-toast-100  rounded-xl p-4">
          {examples.map((e) => (
            <EmojiButton
              emoji={e.emoji}
              onClick={() => {
                if (e.snippet) {
                  setSnippet(e.snippet);
                }
                (window as any).splitbee?.track('Trigger Toast', {
                  example: e.title,
                });
                e.action();
              }}
            >
              {e.title}
            </EmojiButton>
          ))}
        </div>
      </div>
      <div className="h-64 flex items-center language-javascript bg-toast-100 rounded">
        <Code snippet={snippet} />

        {/* <code
          className="p-4 rounded w-full flex-1"
          dangerouslySetInnerHTML={{
            __html: highlight(snippet, languages['javascript'], 'javascript'),
          }}
        ></code> */}
      </div>
    </section>
  );
};
