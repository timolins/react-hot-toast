import React, { useLayoutEffect, useState } from 'react';
import { act, render, screen } from '@testing-library/react';

import toast, { Toaster, useToasterStore } from '../src';
import { dispatch, ActionType, useStore } from '../src/core/store';

beforeEach(() => {
  act(() => toast.remove());
});

// https://github.com/timolins/react-hot-toast/issues/424
test('an idempotent dismiss in a commit-phase effect keyed on toasts converges', () => {
  let effectRuns = 0;
  function DismissStale() {
    const { toasts } = useToasterStore();
    useLayoutEffect(() => {
      effectRuns++;
      toast.dismiss('stale');
    }, [toasts]);
    return null;
  }

  render(<DismissStale />);
  expect(() =>
    act(() => {
      toast('hello', { id: 'stale' });
    })
  ).not.toThrow();
  expect(effectRuns).toBeLessThan(5);
});

test('an idempotent remove in a commit-phase effect keyed on toasts converges', () => {
  let effectRuns = 0;
  function RemoveMissing() {
    const { toasts } = useToasterStore();
    useLayoutEffect(() => {
      effectRuns++;
      toast.remove('nope');
    }, [toasts]);
    return null;
  }

  render(<RemoveMissing />);
  expect(() =>
    act(() => {
      toast('hello');
    })
  ).not.toThrow();
  expect(effectRuns).toBeLessThan(5);
});

test('re-measuring the same height does not notify subscribers', () => {
  let renders = 0;
  function Subscriber() {
    useStore();
    renders++;
    return null;
  }
  render(<Subscriber />);
  act(() => {
    toast('a', { id: 'a' });
  });
  act(() => {
    dispatch({ type: ActionType.UPDATE_TOAST, toast: { id: 'a', height: 50 } });
  });
  const before = renders;
  act(() => {
    dispatch({ type: ActionType.UPDATE_TOAST, toast: { id: 'a', height: 50 } });
  });
  expect(renders).toBe(before);
  act(() => {
    toast.dismiss('a');
  });
  const afterDismiss = renders;
  expect(afterDismiss).toBeGreaterThan(before);
  act(() => {
    toast.dismiss('a');
  });
  expect(renders).toBe(afterDismiss);
});

test('state derived from toasts in an effect converges', () => {
  let effectRuns = 0;
  function VisibleCount() {
    const { toasts } = useToasterStore();
    const [visible, setVisible] = useState(toasts);
    useLayoutEffect(() => {
      effectRuns++;
      setVisible(toasts.filter((t) => t.visible));
    }, [toasts]);
    return <div>{`visible:${visible.length}`}</div>;
  }

  render(<VisibleCount />);
  expect(() =>
    act(() => {
      toast('hello');
    })
  ).not.toThrow();
  expect(screen.getByText('visible:1')).toBeInTheDocument();
  expect(effectRuns).toBeLessThan(5);
});

test('a function message that changes every render does not spin the toaster', async () => {
  const CAP = 50;
  let messageRenders = 0;
  render(<Toaster />);
  act(() => {
    // stop changing the text after CAP renders so the unfixed store fails fast
    toast(
      () => (
        <span>{`render ${
          messageRenders < CAP ? ++messageRenders : messageRenders
        }`}</span>
      ),
      { id: 'spin' }
    );
  });
  // let MutationObserver callbacks and the resulting renders flush
  for (let i = 0; i < 20; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
  expect(screen.getByText(/render \d+/)).toBeInTheDocument();
  expect(messageRenders).toBeLessThan(10);
});
