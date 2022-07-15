import React from 'react';
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';

import toast, { Toaster } from '../src';
import { TOAST_EXPIRE_DISMISS_DELAY } from '../src/core/store';

beforeEach(() => {
  // Tests should run in serial for improved isolation
  // To prevent collision with global state, reset all toasts for each test
  toast.remove();
  jest.useFakeTimers();
});

afterEach((done) => {
  act(() => {
    jest.runAllTimers();
    jest.useRealTimers();
    done();
  });
});

const TOAST_DURATION = 1000;

test('close notification', async () => {
  render(
    <>
      <button
        type="button"
        onClick={() => {
          toast.success((t) => (
            <div>
              Example
              <button
                aria-hidden={!t.visible}
                type="button"
                onClick={() => {
                  toast.dismiss(t.id);
                }}
                title={'close'}
              >
                Close
              </button>
            </div>
          ));
        }}
      >
        Notify!
      </button>
      <Toaster />
    </>
  );

  fireEvent.click(screen.getByRole('button', { name: /Notify/i }));

  await waitFor(() => screen.getByText(/example/i));

  expect(screen.queryByText(/example/i)).toBeInTheDocument();

  fireEvent.click(await screen.findByRole('button', { name: /close/i }));

  act(() => {
    jest.advanceTimersByTime(TOAST_EXPIRE_DISMISS_DELAY);
  });

  expect(screen.queryByText(/example/i)).not.toBeInTheDocument();
});

test('promise toast', async () => {
  const WAIT_DELAY = 1000;

  render(
    <>
      <button
        type="button"
        onClick={() => {
          const sleep = new Promise((resolve) => {
            setTimeout(resolve, WAIT_DELAY);
          });

          toast.promise(sleep, {
            loading: 'Loading...',
            success: 'Success!',
            error: 'Error!',
          });
        }}
      >
        Notify!
      </button>
      <Toaster />
    </>
  );

  act(() => {
    fireEvent.click(screen.getByRole('button', { name: /Notify/i }));
  });

  await screen.findByText(/loading/i);

  expect(screen.queryByText(/loading/i)).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(WAIT_DELAY);
  });

  await waitFor(() => {
    expect(screen.queryByText(/success/i)).toBeInTheDocument();
  });
});

test('error toast', async () => {
  render(
    <>
      <button
        type="button"
        onClick={() => {
          toast.error('An error happened', {
            duration: TOAST_DURATION,
          });
        }}
      >
        Notify!
      </button>
      <Toaster position="bottom-right" />
    </>
  );

  act(() => {
    fireEvent.click(screen.getByRole('button', { name: /Notify/i }));
  });

  await screen.findByText(/error/i);

  expect(screen.queryByText(/error/i)).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(TOAST_DURATION + TOAST_EXPIRE_DISMISS_DELAY);
  });

  expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
});
