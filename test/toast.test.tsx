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
});
