import { useEffect, useMemo, useState } from 'react';
import { dispatch, ActionType, useStore } from './store';

export const useToaster = () => {
  const toasts = useStore();
  const visibleToasts = toasts.filter((t) => t.visible);
  const [pauseAt, setPausedAt] = useState<number | false>(false);

  useEffect(() => {
    if (pauseAt) {
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
  }, [toasts, pauseAt]);

  const handlers = useMemo(
    () => ({
      startPause: () => {
        setPausedAt(Date.now());
      },
      endPause: () => {
        if (pauseAt) {
          const diff = Date.now() - pauseAt;
          dispatch({ type: ActionType.ADD_PAUSE, duration: diff });
          setPausedAt(false);
        }
      },
      updateHeight: (toastId: string, height: number) =>
        dispatch({
          type: ActionType.UPDATE_TOAST,
          toast: { id: toastId, height },
        }),
      calculateOffset: (
        toastId: string,
        {
          reverseOrder = false,
          margin = 8,
        }: { reverseOrder?: boolean; margin?: number }
      ) => {
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
    [toasts, visibleToasts, pauseAt]
  );

  return {
    toasts,
    visibleToasts,
    handlers,
  };
};
