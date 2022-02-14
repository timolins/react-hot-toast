import { css, setup } from 'goober';
import * as React from 'react';
import {
  resolveValue,
  ToastMessageProps,
  ToasterProps,
  ToastPosition,
} from '../core/types';
import { useToaster } from '../core/use-toaster';
import { createRectRef, prefersReducedMotion } from '../core/utils';
import { ToastBar } from './toast-bar';

setup(React.createElement);

const getPositionStyle = (
  position: ToastPosition,
  offset: number
): React.CSSProperties => {
  const top = position.includes('top');
  const verticalStyle: React.CSSProperties = top ? { top: 0 } : { bottom: 0 };
  const horizontalStyle: React.CSSProperties = position.includes('center')
    ? {
        justifyContent: 'center',
      }
    : position.includes('right')
    ? {
        justifyContent: 'flex-end',
      }
    : {};
  return {
    left: 0,
    right: 0,
    display: 'flex',
    position: 'absolute',
    transition: prefersReducedMotion()
      ? undefined
      : `all 230ms cubic-bezier(.21,1.02,.73,1)`,
    transform: `translateY(${offset * (top ? 1 : -1)}px)`,
    ...verticalStyle,
    ...horizontalStyle,
  };
};

const activeClass = css`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;

const DEFAULT_OFFSET = 16;

const ToastMessage: React.FC<ToastMessageProps> = ({
  id,
  height,
  className,
  style,
  onUpdateHeight,
  children,
}) => {
  const hasHeight = typeof height === 'number';
  const ref = React.useMemo(() => {
    return hasHeight
      ? undefined
      : createRectRef((rect) => {
          onUpdateHeight(id, rect.height);
        });
  }, [hasHeight, onUpdateHeight]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export const Toaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  toastOptions,
  gutter,
  children,
  containerStyle,
  containerClassName,
}) => {
  const { toasts, handlers } = useToaster(toastOptions);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: DEFAULT_OFFSET,
        left: DEFAULT_OFFSET,
        right: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET,
        pointerEvents: 'none',
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

        return (
          <ToastMessage
            id={t.id}
            height={t.height}
            className={t.visible ? activeClass : ''}
            key={t.id}
            style={positionStyle}
            onUpdateHeight={handlers.updateHeight}
          >
            {t.type === 'custom' ? (
              resolveValue(t.message, t)
            ) : children ? (
              children(t)
            ) : (
              <ToastBar toast={t} position={toastPosition} />
            )}
          </ToastMessage>
        );
      })}
    </div>
  );
};
