import * as React from 'react';
import { CSSAttribute } from 'goober';
import CSS from 'csstype';

import { useToaster } from '../core/use-toaster';
import { ToastBar } from './toast-bar';
import { ToastPosition, DefaultToastOptions } from '../core/types';

interface ToasterProps {
  position?: ToastPosition;
  reverseOrder?: boolean;
  containerStyle?: CSS.Properties;

  toastOptions?: DefaultToastOptions;
}

const getPositionStyle = (
  position: ToastPosition,
  offset: number
): React.CSSProperties => {
  const top = position.includes('top');
  const verticalStyle: CSSAttribute = top ? { top: 0 } : { bottom: 0 };
  const horizontalStyle: CSSAttribute = position.includes('left')
    ? {
        left: 0,
      }
    : position.includes('right')
    ? {
        right: 0,
      }
    : {
        left: 0,
        pointerEvents: 'none',
        right: 0,
        justifyContent: 'center',
      };
  return {
    display: 'flex',
    position: 'fixed',
    transition: 'all 230ms cubic-bezier(.21,1.02,.73,1)',
    transform: `translateY(${offset * (top ? 1 : -1)}px)`,
    ...verticalStyle,
    ...horizontalStyle,
  };
};

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
        const offset = handlers.calculateOffset(t.id, {
          reverseOrder,
        });
        const positionStyle = getPositionStyle(position, offset);

        return (
          <div
            key={t.id}
            style={{
              zIndex: t.visible ? 9999 : undefined,
              ...positionStyle,
            }}
          >
            <ToastBar
              onHeight={(height) => handlers.updateHeight(t.id, height)}
              toast={t}
              position={position}
            />
          </div>
        );
      })}
    </div>
  );
};
