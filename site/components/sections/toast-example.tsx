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
  saveSettings(settings),
   {
     loading: 'Saving...',
     success: <b>Settings saved!</b>,
     error: <b>Could not save.</b>,
   }
 );`,
    action: () => {
      const promise = new Promise((res, rej) => {
        setTimeout(Math.random() > 0.5 ? res : rej, 1000);
      });

      toast.promise(
        promise,
        {
          loading: 'Saving...',
          success: <b>Settings saved!</b>,
          error: <b>Could not save.</b>,
        },
        {
          style: {
            width: '200px',
            paddingRight: '10px',
          },
        }
      );
    },
  },
  {
    title: 'Multi Line',
    emoji: '↕️',
    snippet: `toast(
  "This toast is super big. I don't think anyone could eat it in one bite.\\n\\nIt's larger than you expected. You eat it but it does not seem to get smaller.",
  {
    duration: 6000,
  }
);`,
    action: () => {
      toast(
        "This toast is super big. I don't think anyone could eat it in one bite.\n\n It's larger than you expected. You eat it but it does not seem to get smaller.",
        {
          duration: 6000,
        }
      );
    },
  },
  {
    title: 'Emoji',
    emoji: '👏',
    snippet: `toast('Good Job!', {
  icon: '👏',
});`,
    action: () => {
      toast('Good Job!', {
        icon: '👏',
      });
    },
  },
  {
    title: 'Dark Mode',
    emoji: '🌚',
    snippet: `toast('Hello Darkness!',
  {
    icon: '👏',
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  }
);`,
    action: () => {
      toast('Hello Darkness!', {
        icon: '👏',

        style: {
          borderRadius: '200px',
          background: '#333',
          color: '#fff',
        },
      });
    },
  },
  {
    title: 'JSX Content',
    emoji: '🔩',
    snippet: `toast((t) => (
  <span>
    Custom and <b>bold</b>
    <button onClick={() => toast.dismiss(t.id)}>
      Dismiss
    </button>
  </span>
));`,

    action: () => {
      toast((t) => (
        <span>
          Custom and <b>bold</b>
          <button
            className="ml-2 py-1 rounded px-2 border bg-gray-100 text-gray-900"
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </span>
      ));
    },
  },
  {
    title: 'Themed',
    emoji: '🎨',
    snippet: `toast.success('Look at my styles.', {
  style: {
    border: '1px solid #713200',
    padding: '16px',
    color: '#713200',
  },
  iconTheme: {
    primary: '#713200',
    secondary: '#FFFAEE',
  },
});`,

    action: () => {
      toast.success('Look at my styles.', {
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
    },
  },
  {
    title: 'Custom Position',
    emoji: '⬆️',
    snippet: `toast.success('Always at the bottom.', {
  position: "bottom-center"
})`,
    action: () => {
      toast.success('Always at the bottom.', {
        position: 'bottom-center',
        duration: 10000,
      });
    },
  },
  {
    title: 'TailwindCSS',
    emoji: '️💨',
    snippet: `toast.custom((t) => (
  <div
    className={\`\${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5\`}
  >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <img
            className="h-10 w-10 rounded-full"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
            alt=""
          />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            Emilia Gates
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Sure! 8:30pm works great!
          </p>
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Close
      </button>
    </div>
  </div>
))`,
    action: () => {
      // toast.custom(<TestApp />);

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Emilia Gates
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Sure! 8:30pm works great!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000,
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
              key={e.title}
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
      <div className="md:h-72 w-full overflow-auto rounded-lg">
        <Code snippet={snippet} className="!h-auto min-h-full" />
      </div>
    </section>
  );
};
