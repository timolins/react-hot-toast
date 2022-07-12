import React from 'react';
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MatchMediaMock from 'jest-matchmedia-mock';

import toast, { Toaster } from '../src';
import { TOAST_EXPIRE_DISMISS_DELAY } from '../src/core/store';

let matchMedia: MatchMediaMock;

beforeAll(() => {
  matchMedia = new MatchMediaMock();
  // matchMedia.useMediaQuery('(prefers-reduced-motion: no-preference)');
});

beforeEach(() => {
  jest.useFakeTimers();
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
      width: 120,
      height: 120,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      toJSON: () => '{}',
    };
  });
});

afterEach((done) => {
  act(() => {
    jest.runAllTimers();
    jest.useRealTimers();
    done();
  });
});

afterAll(() => {
  matchMedia.destroy();
});

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

  expect(screen.queryByText(/Success/i)).not.toBeInTheDocument();
});

test('error toast', async () => {
  // matchMedia.useMediaQuery('(prefers-reduced-motion: no-preference)');

  const DURATION = 1000;

  render(
    <>
      <button
        type="button"
        onClick={() => {
          toast.error('An error happened', {
            duration: DURATION,
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
    jest.advanceTimersByTime(DURATION + TOAST_EXPIRE_DISMISS_DELAY);
  });

  expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
});
