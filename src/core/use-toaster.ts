import { useEffect, useCallback } from 'react';
import { createDispatch, ActionType, useStore, dispatch } from './store';
import { toast } from './toast';
import { DefaultToastOptions, Toast, ToastPosition } from './types';

export const REMOVE_DELAY = 1000;

// Shared by every useToaster instance of a toaster, so a pending removal can be
// cancelled by any instance still mounted, not only the one that queued it.
const toastTimeouts = new Map<
  string,
  Map<Toast['id'], ReturnType<typeof setTimeout>>
>();

const getToasterTimeouts = (toasterId: string) => {
  let timeouts = toastTimeouts.get(toasterId);
  if (!timeouts) {
    timeouts = new Map();
    toastTimeouts.set(toasterId, timeouts);
  }
  return timeouts;
};

const addToRemoveQueue = (
  toasterId: string,
  toastId: string,
  removeDelay = REMOVE_DELAY
) => {
  const timeouts = getToasterTimeouts(toasterId);
  if (timeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    timeouts.delete(toastId);
    dispatch(
      {
        type: ActionType.REMOVE_TOAST,
        toastId: toastId,
      },
      toasterId
    );
  }, removeDelay);

  timeouts.set(toastId, timeout);
};

const cancelRemoval = (toasterId: string, toastId: string) => {
  const timeouts = toastTimeouts.get(toasterId);
  const timeout = timeouts?.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
    timeouts!.delete(toastId);
  }
};

export const useToaster = (
  toastOptions?: DefaultToastOptions,
  toasterId: string = 'default'
) => {
  const { toasts, pausedAt } = useStore(toastOptions, toasterId);

  useEffect(() => {
    if (pausedAt) {
      return;
    }

    const now = Date.now();
    const timeouts = toasts.map((t) => {
      if (t.duration === Infinity) {
        return;
      }

      const durationLeft =
        (t.duration || 0) + t.pauseDuration - (now - t.createdAt);

      if (durationLeft < 0) {
        if (t.visible) {
          toast.dismiss(t.id);
        }
        return;
      }
      return setTimeout(() => toast.dismiss(t.id, toasterId), durationLeft);
    });

    return () => {
      timeouts.forEach((timeout) => timeout && clearTimeout(timeout));
    };
  }, [toasts, pausedAt, toasterId]);

  const dispatch = useCallback(createDispatch(toasterId), [toasterId]);

  const startPause = useCallback(() => {
    dispatch({
      type: ActionType.START_PAUSE,
      time: Date.now(),
    });
  }, [dispatch]);

  const updateHeight = useCallback(
    (toastId: string, height: number) => {
      dispatch({
        type: ActionType.UPDATE_TOAST,
        toast: { id: toastId, height },
      });
    },
    [dispatch]
  );

  const endPause = useCallback(() => {
    if (pausedAt) {
      dispatch({ type: ActionType.END_PAUSE, time: Date.now() });
    }
  }, [pausedAt, dispatch]);

  const calculateOffset = useCallback(
    (
      toast: Toast,
      opts?: {
        reverseOrder?: boolean;
        gutter?: number;
        defaultPosition?: ToastPosition;
      }
    ) => {
      const { reverseOrder = false, gutter = 8, defaultPosition } = opts || {};

      const relevantToasts = toasts.filter(
        (t) =>
          (t.position || defaultPosition) ===
            (toast.position || defaultPosition) && t.height
      );
      const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
      const toastsBefore = relevantToasts.filter(
        (toast, i) => i < toastIndex && toast.visible
      ).length;

      const offset = relevantToasts
        .filter((t) => t.visible)
        .slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
        .reduce((acc, t) => acc + (t.height || 0) + gutter, 0);

      return offset;
    },
    [toasts]
  );

  // Keep track of dismissed toasts and remove them after the delay
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.dismissed) {
        addToRemoveQueue(toasterId, toast.id, toast.removeDelay);
      } else {
        // If toast becomes visible again, remove it from the queue
        cancelRemoval(toasterId, toast.id);
      }
    });
  }, [toasts, toasterId]);

  return {
    toasts,
    handlers: {
      updateHeight,
      startPause,
      endPause,
      calculateOffset,
    },
  };
};
