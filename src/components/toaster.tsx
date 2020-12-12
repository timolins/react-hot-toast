import * as React from 'react';
import { setup } from 'goober';
import { Properties } from 'csstype';

import { useToaster } from '../core/use-toaster';
import { dispatch, ActionType } from '../core/store';
import { ToastBar } from './toast-bar';
import { ToastPosition } from '../core/types';
import { IndicatorTheme } from './indicator';
export { ToastType } from '../core/types';

setup(React.createElement);

const MARGIN = 8;

interface ToasterProps {
  position?: ToastPosition;
  zIndex?: number | false;
  reverseOrder?: boolean;

  toastStyle?: Properties;
  toastClassName?: string;
  iconTheme?: IndicatorTheme;
}

export const Toaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  zIndex = 9999,
  iconTheme,
  ...props
}) => {
  const [toasts, handlers] = useToaster();
  const visibleToasts = toasts.filter((t) => t.height && t.visible);

  return (
    <div
      style={{
        position: 'fixed',
        [position.includes('top') ? 'top' : 'bottom']: 0,
      }}
      {...handlers}
    >
      {toasts.map((t) => {
        const index = visibleToasts.findIndex((toast) => toast.id === t.id);
        const offset =
          index !== -1
            ? visibleToasts
                .slice(...(reverseOrder ? [index + 1] : [0, index]))
                .reduce((acc, s) => acc + (s.height || 0) + MARGIN, 0)
            : 0;

        return (
          <ToastBar
            key={t.id}
            onHeight={(height) =>
              dispatch({
                type: ActionType.UPDATE_TOAST,
                toast: { ...t, height },
              })
            }
            zIndex={t.visible && zIndex}
            toast={t}
            position={position}
            offset={offset}
            iconTheme={iconTheme}
            className={props.toastClassName}
            style={props.toastStyle}
          />
        );
      })}
    </div>
  );
};
