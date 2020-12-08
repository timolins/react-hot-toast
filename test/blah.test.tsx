import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToastsContainer, notify } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    notify.success('Hello World');
    ReactDOM.render(<ToastsContainer />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
