import * as React from 'react';
import { setup } from 'goober';

import { StatusBar } from './components/toast';
import {
  useToasts,
  notify,
  notifyPromise,
  setNotification,
} from './core/use-toasts';
import { StatusType } from './status';

export { StatusBar, notify, notifyPromise };

setup(React.createElement);

export { StatusType };

const MARGIN = 8;

export const ToastsContainer = () => {
  const [toasts, handlers] = useToasts();
  const visibleToasts = toasts.filter((t) => t.height && t.visible);

  return (
    <div {...handlers}>
      {toasts.map((s) => {
        const index = visibleToasts.findIndex((toast) => toast.id === s.id);
        const offset = visibleToasts
          .slice(index + 1)
          .reduce((acc, s) => acc + (s.height || 0) + MARGIN, 0);

        return (
          <StatusBar
            onHeight={(height) => setNotification({ ...s, height })}
            key={s.id}
            status={s}
            offset={offset}
          />
        );
      })}
    </div>
  );
};
