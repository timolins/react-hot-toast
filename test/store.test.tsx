import React from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';

import toast, { useToasterStore } from '../src';
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

describe('changing toasterId', () => {
  test('switches from stored toasts to an empty toaster without crashing', () => {
    act(() => {
      toast('First toaster', { toasterId: 'switch-initial' });
    });

    const { result, rerender } = renderHook(
      ({ toasterId }) => useToasterStore(undefined, toasterId),
      { initialProps: { toasterId: 'switch-initial' } }
    );
    expect(result.current.toasts).toHaveLength(1);

    expect(() => rerender({ toasterId: 'switch-empty-initial' })).not.toThrow();
    expect(result.current.toasts).toEqual([]);
  });

  test('clears toasts added after mount when switching to an empty toaster', () => {
    const { result, rerender } = renderHook(
      ({ toasterId }) => useToasterStore(undefined, toasterId),
      { initialProps: { toasterId: 'switch-late' } }
    );

    act(() => {
      toast('First toaster', { toasterId: 'switch-late' });
    });
    expect(result.current.toasts).toHaveLength(1);

    rerender({ toasterId: 'switch-empty-late' });
    expect(result.current.toasts).toEqual([]);

    act(() => {
      toast('Old toaster update', { toasterId: 'switch-late' });
      toast('New toaster update', { toasterId: 'switch-empty-late' });
    });
    expect(result.current.toasts.map((t) => t.message)).toEqual([
      'New toaster update',
    ]);
  });

  test('restores the selected snapshot when switching back to the initial toaster', () => {
    act(() => {
      toast('First toaster', { toasterId: 'switch-back-first' });
      toast('Second toaster', { toasterId: 'switch-back-second' });
    });

    const { result, rerender } = renderHook(
      ({ toasterId }) => useToasterStore(undefined, toasterId),
      { initialProps: { toasterId: 'switch-back-first' } }
    );
    expect(result.current.toasts.map((t) => t.message)).toEqual([
      'First toaster',
    ]);

    rerender({ toasterId: 'switch-back-second' });
    expect(result.current.toasts.map((t) => t.message)).toEqual([
      'Second toaster',
    ]);

    rerender({ toasterId: 'switch-back-first' });
    expect(result.current.toasts.map((t) => t.message)).toEqual([
      'First toaster',
    ]);
  });
});
