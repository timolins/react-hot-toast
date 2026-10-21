import React from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';

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

test('preserves removeDelay of 0 when configured at toast or toaster options', () => {
  const { result } = renderHook(() =>
    useStore({
      removeDelay: 500,
    })
  );

  act(() => {
    toast('zero delay', { removeDelay: 0 });
  });

  expect(result.current.toasts[0].removeDelay).toBe(0);
});
