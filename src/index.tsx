import * as React from 'react';
import { setup } from 'goober';

import { StatusBar } from './components/toast';
import { useToasts, notify, notifyPromise } from './core/use-toasts';
import { StatusType } from './status';

export { StatusBar, notify, notifyPromise };

setup(React.createElement);

export { StatusType };

export const ToastsContainer = () => {
  const [toasts, handlers] = useToasts();
  const visibleToasts = toasts.filter((t) => t.visible);

  return (
    <div {...handlers}>
      {toasts.map((s) => (
        <StatusBar
          key={s.id}
          visible={s.visible}
          status={s}
          index={
            visibleToasts.length -
            1 -
            visibleToasts.findIndex((toast) => toast.id === s.id)
          }
        />
      ))}
    </div>
  );
};
