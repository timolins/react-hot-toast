import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import toast, { Toaster, useToaster } from '../.';
import { useState } from 'react';

const positions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

const App = () => {
  const [position, setPosition] = useState<any>('top-center');
  const [reverse, setReverse] = useState(false);
  React.useEffect(() => {
    console.log(123);
  });
  return (
    <div className="flex items-center justify-center h-full bg-gray-300">
      123
      <fieldset className="grid grid-cols-3 gap-4 ">
        {positions.map((p) => (
          <div className="bg-green-100 rounded" key={p}>
            <input
              key={p}
              id={p}
              type="radio"
              checked={position === p}
              onChange={() => {
                toast.remove();
                toast.success(
                  <span>
                    Position set to <b>{p}</b>
                  </span>
                );
                toast('Yes', {
                  icon: 'Servas',
                  style: {
                    background: '#FFFAEE',
                    color: '#713200',
                  },
                });
                setPosition(p);
              }}
            />
            <label htmlFor={p}>{p}</label>
          </div>
        ))}
      </fieldset>
      <button
        onClick={() => {
          toast.remove();
          toast('Notification 1', {
            icon: '1️⃣',
          });
          setTimeout(
            () =>
              toast('Notification 2', {
                icon: '2️⃣',
              }),
            400
          );
          setTimeout(
            () =>
              toast('Notification 3', {
                icon: '3️⃣',
              }),
            800
          );
          setReverse(!reverse);
        }}
      >
        Toggle
      </button>
      <button
        onClick={() => {
          // notify.error('This went wrong.');
          toast.error('This went wrong.');
          const t2 = toast.error('This went wrong.');

          // notify.error('This went wrong.');
          const t = toast('This is an error');

          setTimeout(() => {
            toast.dismiss(t2);
            toast.success('yess', { id: t, icon: undefined });
          }, 1000);
        }}
      >
        Complex Example
      </button>
      <button
        onClick={() => {
          toast.success('Project created');
        }}
      >
        Success
      </button>
      <button
        onClick={() => {
          toast(
            <span>
              Custom and <b>bold</b>
            </span>,
            {
              icon: '👏',
              style: {
                background: '#333',
                color: 'white',
              },
            }
          );
        }}
      >
        Custom
      </button>
      <button
        onClick={() => {
          toast.success(
            'This is a ultra long Jobs thing this is so long wowo I cant believe it maybe we should stop at some point'
          );
        }}
      >
        Long
      </button>
      <button
        onClick={() => {
          const promise = new Promise<undefined>((res, rej) => {
            setTimeout(Math.random() > 0.5 ? res : rej, 1000);
          });

          toast.promise(
            promise,
            {
              error: <b>ERROR</b>,
              success: 'Success',
              loading: 'Loading',
            },
            {
              error: { duration: 100 },
              loading: { duration: 2000 },
            }
          );
        }}
      >
        Promise
      </button>
      <Toaster position={position} reverseOrder={reverse} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
