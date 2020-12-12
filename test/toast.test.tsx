import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Toaster, toast } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    toast('Hello World');
    ReactDOM.render(<Toaster />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  it('call all functions without crashing', () => {
    const div = document.createElement('div');
    toast('Hello World');
    toast.success('Success');
    toast.error('Success', {
      duration: 2000,
    });
    toast.loading('loading');

    toast(
      <span>
        I'm <b>custom</b>
      </span>,
      {
        icon: '👏',
      }
    );

    ReactDOM.render(<Toaster />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  it('toast a promise', () => {
    const promise = new Promise((res) => {
      setTimeout(res, 1000);
    });

    toast.promise(
      promise,
      {
        error: <b>ERROR</b>,
        success: 'Success',
        loading: 'Loading',
      },
      {
        error: { duration: 1000 },
        loading: { duration: 2000 },
      }
    );
  });
});
