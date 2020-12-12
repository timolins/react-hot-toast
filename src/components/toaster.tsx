import * as React from 'react';
import { setup } from 'goober';
import { Properties } from 'csstype';

import { useToaster } from '../core/use-toaster';
import { ToastBar } from './toast-bar';
import { ToastPosition } from '../core/types';
import { IndicatorTheme } from './indicator';
export { ToastType } from '../core/types';

setup(React.createElement);

interface ToasterProps {
  position?: ToastPosition;
  reverseOrder?: boolean;

  toastStyle?: Properties;
  toastClassName?: string;
  iconTheme?: IndicatorTheme;
}

export const Toaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  iconTheme,
  ...props
}) => {
  const { toasts, handlers } = useToaster();

  return (
    <div
      style={{
        position: 'fixed',
        [position.includes('top') ? 'top' : 'bottom']: 0,
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
            position={position}
            offset={handlers.calculateOffset(t.id, {
              reverseOrder,
            })}
            iconTheme={iconTheme}
            className={props.toastClassName}
            style={props.toastStyle}
          />
        );
      })}
    </div>
  );
};
