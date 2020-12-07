import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Thing, notify, notifyPromise, StatusType } from '../.';

const App = () => {
  React.useEffect(() => {
    console.log(123);
  });
  return (
    <div>
      123
      <button
        onClick={() => {
          notify({ message: 'Servas', type: StatusType.Error });
        }}
      >
        Hello
      </button>
      <button
        onClick={() => {
          notify({ message: 'Servas', type: StatusType.Success });
        }}
      >
        Hello
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
      <Thing />{' '}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
