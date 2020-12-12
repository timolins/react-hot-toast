import * as React from 'react';
import { DefaultTheme, setup } from 'goober';
import { Properties } from 'csstype';

import { useToaster } from '../core/use-toaster';
import { dispatch, ActionType } from '../core/store';
import { ToastBar } from './toast-bar';
import { ToastPosition } from '../core/types';
export { ToastType } from '../core/types';

const theme: DefaultTheme = {
  colors: {
    background: '#fff',
    text: '#363636',
    success: 'green',
    error: 'red',
  },
};

// const theme: DefaultTheme = {
//   colors: {
//     text: '#fff',
//     background: '#363636',
//     success: 'green',
//     error: 'red',
//   },
// };

const ThemeContext = React.createContext(theme);
const useTheme = () => React.useContext(ThemeContext);

setup(React.createElement, undefined, useTheme);

const MARGIN = 8;

interface ToasterProps {
  position?: ToastPosition;
  zIndex?: number | false;
  reverseOrder?: boolean;

  containerStyle?: Properties;
  containerClassName?: string;
  toastStyle?: Properties;
  toastClassName?: string;
}

export const Toaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  zIndex = 9999,
  ...props
}) => {
  const [toasts, handlers] = useToaster();
  const visibleToasts = toasts.filter((t) => t.height && t.visible);

  return (
    <ThemeContext.Provider value={theme}>
      <div
        className={props.containerClassName}
        style={{
          position: 'fixed',
          [position.includes('top') ? 'top' : 'bottom']: 0,
          ...props.containerStyle,
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
              className={props.toastClassName}
              style={props.toastStyle}
            />
          );
        })}
      </div>
    </ThemeContext.Provider>
  );
};
