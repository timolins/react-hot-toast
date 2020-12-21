import { useEffect, useMemo } from 'react';
import { dispatch, ActionType, useStore } from './store';

export const useToaster = () => {
  const { toasts, pausedAt } = useStore();
  const visibleToasts = toasts.filter((t) => t.visible);

  useEffect(() => {
    if (pausedAt) {
      return;
    }

    const now = Date.now();
    const timeouts = toasts.map((t) => {
      const duration = t.duration - (now - t.createdAt);
      const dismiss = () => {
        dispatch({
          type: ActionType.DISMISS_TOAST,
          toastId: t.id,
        });
        setTimeout(() => {
          dispatch({
            type: ActionType.REMOVE_TOAST,
            toastId: t.id,
          });
        }, 1000);
      };

      if (duration < 0) {
        if (t.visible) {
          dismiss();
        }
        return;
      }
      return setTimeout(dismiss, duration);
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
        const index = visibleToasts.findIndex((toast) => toast.id === toastId);
        const offset =
          index !== -1
            ? visibleToasts
                .slice(...(reverseOrder ? [index + 1] : [0, index]))
                .reduce((acc, t) => acc + (t.height || 0) + margin, 0)
            : 0;

        return offset;
      },
    }),
    [visibleToasts, pausedAt]
  );

  return {
    toasts,
    visibleToasts,
    handlers,
  };
};
