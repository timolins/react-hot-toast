import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToastsContainer, notify, notifyPromise, StatusType } from '../.';

const App = () => {
  React.useEffect(() => {
    console.log(123);
  });
  return (
    <div>
      123
      <button
        onClick={() => {
          notify.error('This went wrong.');
        }}
      >
        Error
      </button>
      <button
        onClick={() => {
          notify.success('Project created');
        }}
      >
        Success
      </button>
      <button
        onClick={() => {
          notify.custom('Noel hat Jobs');
        }}
      >
        Custom
      </button>
      <button
        onClick={() => {
          const promise = new Promise((res, rej) => {
            setTimeout(Math.random() > 0.5 ? res : rej, 1000);
          });
          notifyPromise(promise, {
            error: 'ERROR',
            success: 'Juhu',
            loading: 'Loading',
          });
        }}
      >
        Promise
      </button>
      <ToastsContainer />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
