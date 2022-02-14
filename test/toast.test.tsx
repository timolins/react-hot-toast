import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchMediaMock from 'jest-matchmedia-mock';
import toast, { Toaster } from '../src';
import { TOAST_EXPIRE_DISMISS_DELAY } from '../src/core/store';

let matchMedia: MatchMediaMock;

beforeAll(() => {
  matchMedia = new MatchMediaMock();
  matchMedia.useMediaQuery('(prefers-reduced-motion: reduce)');
});

beforeEach(() => {
  jest.useFakeTimers();
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
      <Toaster />
      <button
        type="button"
        onClick={() => {
          toast((t) => (
            <div>
              Example
              <button
                aria-hidden={typeof t.height !== 'number'}
                type="button"
                onClick={() => toast.dismiss(t.id)}
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
    </>
  );
  userEvent.click(screen.getByRole('button', { name: /notify/i }));
  screen.getByText(/example/i);

  userEvent.click(await screen.findByRole('button', { name: /close/i }));
  act(() => {
    jest.advanceTimersByTime(TOAST_EXPIRE_DISMISS_DELAY);
  });
  expect(screen.queryByText(/example/i)).not.toBeInTheDocument();
});
