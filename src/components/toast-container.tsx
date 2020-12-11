import * as React from 'react';
import { setup } from 'goober';

import { useToasts } from '../core/use-toasts';
import { dispatch, ActionType } from '../core/store';
import { ToastBar } from './toast-bar';
export { ToastType } from '../core/types';

setup(React.createElement);

const MARGIN = 8;

export const ToastsContainer = () => {
  const [toasts, handlers] = useToasts();
  const visibleToasts = toasts.filter((t) => t.height && t.visible);
  return (
    <div {...handlers}>
      {toasts.map((s) => {
        const index = visibleToasts.findIndex((toast) => toast.id === s.id);
        const offset =
          index !== -1
            ? visibleToasts
                .slice(0, index)
                .reduce((acc, s) => acc + (s.height || 0) + MARGIN, 0)
            : 0;

        return (
          <ToastBar
            onHeight={(height) =>
              dispatch({
                type: ActionType.UPDATE_TOAST,
                toast: { ...s, height },
              })
            }
            key={s.id}
            status={s}
            offset={offset}
          />
        );
      })}
    </div>
  );
};
