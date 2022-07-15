import { useEffect, useLayoutEffect, useCallback } from 'react';
import { dispatch, ActionType, useStore } from './store';
import { toast } from './toast';
import { DefaultToastOptions, Toast, ToastPosition } from './types';

// Prevent useLayoutEffect warning from being used on the the server
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const setHeightGetter = (toastId: string, getHeight: () => number) => {
  dispatch({
    type: ActionType.UPDATE_TOAST,
    toast: { id: toastId, getHeight },
  });
};
const startPause = () => {
  dispatch({
    type: ActionType.START_PAUSE,
    time: Date.now(),
  });
};

export const useToaster = (toastOptions?: DefaultToastOptions) => {
  const { toasts, pausedAt } = useStore(toastOptions);

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
      return setTimeout(() => toast.dismiss(t.id), durationLeft);
    });

    return () => {
      timeouts.forEach((timeout) => timeout && clearTimeout(timeout));
    };
  }, [toasts, pausedAt]);

  const endPause = useCallback(() => {
    if (pausedAt) {
      dispatch({ type: ActionType.END_PAUSE, time: Date.now() });
    }
  }, [pausedAt]);

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

  useIsomorphicLayoutEffect(() => {
    for (const t of toasts) {
      if (!t.visible || !t.getHeight) {
        return;
      }

      const height = t.getHeight();

      if (height !== t.height) {
        dispatch({
          type: ActionType.UPDATE_TOAST,
          toast: { id: t.id, height },
        });
      }
    }
  }, [toasts]);

  return {
    toasts,
    handlers: {
      setHeightGetter,
      startPause,
      endPause,
      calculateOffset,
    },
  };
};
