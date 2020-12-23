import * as React from 'react';
import { setup } from 'goober';
import CSS from 'csstype';

import { useToaster } from '../core/use-toaster';
import { ToastBar } from './toast-bar';
import { ToastPosition, DefaultToastOptions } from '../core/types';

setup(React.createElement);

interface ToasterProps {
  position?: ToastPosition;
  reverseOrder?: boolean;
  containerStyle?: CSS.Properties;

  toastOptions?: DefaultToastOptions;
}

export const Toaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  containerStyle,
  toastOptions,
}) => {
  const { toasts, handlers } = useToaster(toastOptions);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        ...containerStyle,
      }}
      onMouseEnter={handlers.startPause}
      onMouseLeave={handlers.endPause}
    >
      {toasts.map((t) => {
        return (
          <ToastBar
            key={t.id}
            onHeight={(height) => handlers.updateHeight(t.id, height)}
            toast={t}
            offset={handlers.calculateOffset(t.id, {
              reverseOrder,
            })}
            position={position}
          />
        );
      })}
    </div>
  );
};
