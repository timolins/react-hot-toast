import { useEffect, useMemo } from 'react';
import { dispatch, ActionType, useStore } from './store';
import { toast } from './toast';
import { DefaultToastOptions } from './types';

export const useToaster = (toastOptions?: DefaultToastOptions) => {
  const { toasts, pausedAt } = useStore(toastOptions);
  const visibleToasts = toasts.filter((t) => t.visible);

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

  const handlers = useMemo(
    () => ({
      startPause: () => {
        dispatch({
          type: ActionType.START_PAUSE,
          time: Date.now(),
        });
      },
      endPause: () => {
        if (pausedAt) {
          dispatch({ type: ActionType.END_PAUSE, time: Date.now() });
        }
      },
      updateHeight: (toastId: string, height: number) =>
        dispatch({
          type: ActionType.UPDATE_TOAST,
          toast: { id: toastId, height },
        }),
      calculateOffset: (
        toastId: string,
        opts?: { reverseOrder?: boolean; margin?: number }
      ) => {
        const { reverseOrder = false, margin = 8 } = opts || {};
        const toastIndex = toasts.findIndex((toast) => toast.id === toastId);
        const toastsBefore = toasts.filter(
          (toast, i) => i < toastIndex && toast.visible
        ).length;

        const offset = visibleToasts
          .slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
          .reduce((acc, t) => acc + (t.height || 0) + margin, 0);

        return offset;
      },
    }),
    [toasts, visibleToasts, pausedAt]
  );

  return {
    toasts,
    visibleToasts,
    handlers,
  };
};
