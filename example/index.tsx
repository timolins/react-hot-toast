import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import toast, { ToastsContainer } from '../.';

const App = () => {
  React.useEffect(() => {
    console.log(123);
  });
  return (
    <div>
      123
      <button
        onClick={() => {
          // notify.error('This went wrong.');
          toast.error('This went wrong.');
          const t2 = toast.error('This went wrong.');

          // notify.error('This went wrong.');
          const t = toast('This is an error', {
            type: 'error',
          });

          setTimeout(() => {
            toast.dismiss(t2);
            toast.success('yess', { id: t, icon: undefined });
          }, 1000);
        }}
      >
        Error
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
      <ToastsContainer />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
