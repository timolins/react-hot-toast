import React from 'react';
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';

import toast, { resolveValue, Toaster, ToastIcon } from '../src';
import { TOAST_EXPIRE_DISMISS_DELAY, defaultTimeouts } from '../src/core/store';

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

const waitTime = (time: number) => {
  act(() => {
    jest.advanceTimersByTime(time);
  });
};

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

  waitTime(TOAST_EXPIRE_DISMISS_DELAY);

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

  waitTime(WAIT_DELAY);

  await waitFor(() => {
    expect(screen.queryByText(/success/i)).toBeInTheDocument();
  });
});

test('promise toast error', async () => {
  const WAIT_DELAY = 1000;

  render(
    <>
      <button
        type="button"
        onClick={() => {
          const sleep = new Promise((_, rej) => {
            setTimeout(rej, WAIT_DELAY);
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

  waitTime(WAIT_DELAY);

  await waitFor(() => {
    expect(screen.queryByText(/error/i)).toBeInTheDocument();
  });
});

test('error toast with custom duration', async () => {
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

  waitTime(TOAST_DURATION + TOAST_EXPIRE_DISMISS_DELAY);

  expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
});

test('different toasts types with dismiss', async () => {
  render(
    <>
      <Toaster />
    </>
  );

  act(() => {
    toast.success('Success!');
  });

  act(() => {
    toast.error('Error!');
  });

  act(() => {
    toast('Emoji Icon', {
      icon: '✅',
    });
  });

  act(() => {
    toast('Custom Icon', {
      icon: <span>ICON</span>,
    });
  });

  let loadingToastId: string;
  act(() => {
    loadingToastId = toast.loading('Loading!');
  });

  expect(screen.queryByText(/error/i)).toBeInTheDocument();
  expect(screen.queryByText(/success/i)).toBeInTheDocument();
  expect(screen.queryByText(/loading/i)).toBeInTheDocument();
  expect(screen.queryByText('✅')).toBeInTheDocument();
  expect(screen.queryByText('ICON')).toBeInTheDocument();

  const successDismissTime =
    defaultTimeouts.success + TOAST_EXPIRE_DISMISS_DELAY;

  waitTime(successDismissTime);

  expect(screen.queryByText(/success/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/error/i)).toBeInTheDocument();

  waitTime(
    defaultTimeouts.error + TOAST_EXPIRE_DISMISS_DELAY - successDismissTime
  );

  expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

  act(() => {
    toast.dismiss(loadingToastId);
  });

  waitTime(TOAST_EXPIRE_DISMISS_DELAY);

  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

test('custom toaster renderer', async () => {
  render(
    <>
      <Toaster>
        {(t) => (
          <div className="custom-toast">
            <ToastIcon toast={t} />
            {resolveValue(t.message, t)}
          </div>
        )}
      </Toaster>
    </>
  );

  act(() => {
    toast.success('Success!');
  });

  expect(screen.queryByText(/success/i)).toHaveClass('custom-toast');

  act(() => {
    toast(<b>Bold</b>);
  });

  expect(screen.queryByText(/bold/i)).toBeInTheDocument();

  act(() => {
    toast.custom('Custom');
  });

  expect(screen.queryByText(/custom/i)).not.toHaveClass('custom-toast');
});

test('pause toast', async () => {
  render(
    <>
      <Toaster>
        {(t) => (
          <div className="custom-toast">
            <ToastIcon toast={t} />
            {resolveValue(t.message, t)}
          </div>
        )}
      </Toaster>
    </>
  );

  act(() => {
    toast.success('Hover me!', {
      duration: 1000,
    });
  });

  waitTime(500);

  const toastElement = screen.getByText(/hover me/i);

  expect(toastElement).toBeInTheDocument();

  fireEvent.mouseEnter(toastElement);

  waitTime(10000);

  expect(toastElement).toBeInTheDocument();

  fireEvent.mouseLeave(toastElement);

  waitTime(2000);

  expect(toastElement).not.toBeInTheDocument();
});
