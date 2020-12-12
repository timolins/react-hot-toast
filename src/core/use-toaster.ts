import { useEffect, useMemo, useState } from 'react';
import { dispatch, ActionType, useStore } from './store';

export const useToaster = () => {
  const queue = useStore();
  const [pauseAt, setPausedAt] = useState<number | false>(false);

  useEffect(() => {
    if (pauseAt) {
      return;
    }

    const now = Date.now();
    const timeouts = queue.map((t) => {
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
  }, [queue, pauseAt]);

  const handlers = useMemo(
    () => ({
      onMouseEnter: () => {
        setPausedAt(Date.now());
      },
      onMouseLeave: () => {
        if (pauseAt) {
          const diff = Date.now() - pauseAt;
          dispatch({ type: ActionType.ADD_PAUSE, duration: diff });
          setPausedAt(false);
        }
      },
    }),
    [queue, pauseAt]
  );

  return [queue, handlers] as const;
};
