import * as React from 'react';
import { setup } from 'goober';

import { useToaster } from '../core/use-toaster';
import { ToastBar } from './toast-bar';
import {
  ToastPosition,
  DefaultToastOptions,
  Toast,
  resolveValue,
} from '../core/types';
import { createRectRef, prefersReducedMotion } from '../core/utils';

setup(React.createElement);

const getPositionStyle = (
  position: ToastPosition,
  offset: number
): React.CSSProperties => {
  const top = position.includes('top');
  const verticalStyle: React.CSSProperties = top ? { top: 0 } : { bottom: 0 };
  const horizontalStyle: React.CSSProperties = position.includes('left')
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
    position: 'absolute',
    transition: `all ${
      prefersReducedMotion() ? 0 : 230
    }ms cubic-bezier(.21,1.02,.73,1)`,
    transform: `translateY(${offset * (top ? 1 : -1)}px)`,
    ...verticalStyle,
    ...horizontalStyle,
  };
};

interface ToasterProps {
  position?: ToastPosition;
  reverseOrder?: boolean;
  gutter?: number;
  containerStyle?: React.CSSProperties;
  containerClassName?: string;

  toastOptions?: DefaultToastOptions;
  renderToast?: (toast: Toast) => JSX.Element;
}

export const Toaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  containerStyle,
  toastOptions,
  containerClassName,
  renderToast,
}) => {
  const { toasts, handlers } = useToaster(toastOptions);

  return (
    <div
      style={{
        top: 16,
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 9999,
        pointerEvents: 'none',
        position: 'fixed',
        ...containerStyle,
      }}
      className={containerClassName}
      onMouseEnter={handlers.startPause}
      onMouseLeave={handlers.endPause}
    >
      {toasts.map((t) => {
        const toastPosition = t.position || position;
        const offset = handlers.calculateOffset(t, {
          reverseOrder,
          gutter,
          defaultPosition: position,
        });
        const positionStyle = getPositionStyle(toastPosition, offset);

        const ref = t.height
          ? undefined
          : createRectRef((rect) => {
              handlers.updateHeight(t.id, rect.height);
            });

        return (
          <div
            ref={ref}
            key={t.id}
            style={{
              zIndex: t.visible ? 9999 : undefined,
              ...positionStyle,
            }}
          >
            {t.type === 'custom' ? (
              resolveValue(t.message, t)
            ) : renderToast ? (
              renderToast(t)
            ) : (
              <ToastBar toast={t} position={toastPosition} />
            )}
          </div>
        );
      })}
    </div>
  );
};
