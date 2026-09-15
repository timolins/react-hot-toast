import React from 'react';
import { act, render, screen } from '@testing-library/react';

import toast from '../src';
import { useStore } from '../src/core/store';

function Subscriber({ name }: { name: string }) {
  const { toasts } = useStore();
  return <div>{`${name}:${toasts.length}`}</div>;
}

beforeEach(() => {
  act(() => toast.remove());
});

// Regression test for https://github.com/timolins/react-hot-toast/issues/428
test('keeps a subscriber active when another subscriber with the same toasterId unmounts', () => {
  const { rerender } = render(
    <>
      <Subscriber name="A" />
      <Subscriber name="B" />
    </>
  );

  act(() => {
    toast('first');
  });
  expect(screen.getByText('A:1')).toBeInTheDocument();
  expect(screen.getByText('B:1')).toBeInTheDocument();

  rerender(<Subscriber name="A" />);

  act(() => {
    toast('second');
  });
  expect(screen.getByText('A:2')).toBeInTheDocument();
});
