import goober, { css, CSSAttribute, setup } from 'goober';
import * as React from 'react';
import { resolveValue, ToasterProps, ToastPosition } from '../core/types';
import { useToaster } from '../core/use-toaster';
import { createRectRef, prefersReducedMotion } from '../core/utils';
import { ToastBar } from './toast-bar';

setup(React.createElement);

const getPositionStyle = (
  position: ToastPosition,
  offset: number
): string => {
  const top = position.includes('top');
  const verticalStyle: CSSAttribute = top ? { top: 0 } : { bottom: 0 };
  const horizontalStyle: CSSAttribute = position.includes('center')
    ? {
        justifyContent: 'center',
      }
    : position.includes('right')
    ? {
        justifyContent: 'flex-end',
      }
    : {};

  const ovenRack = css({
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
  });

  return ovenRack;
};

const activeClass = css`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;

const DEFAULT_OFFSET = '16';

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

  const toasterOven = css({
    position: 'fixed',
    zIndex: 9999,
    top: DEFAULT_OFFSET,
    left: DEFAULT_OFFSET,
    right: DEFAULT_OFFSET,
    bottom: DEFAULT_OFFSET,
    pointerEvents: 'none',
    ...(containerStyle as goober.CSSAttribute)
  });

  return (
    <div
      className={containerClassName ? `${containerClassName} ${toasterOven}` : toasterOven}
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
        const toasterClass = getPositionStyle(toastPosition, offset);

        const ref = t.height
          ? undefined
          : createRectRef((rect) => {
              handlers.updateHeight(t.id, rect.height);
            });

        return (
          <div
            ref={ref}
            className={t.visible ? `${activeClass} ${toasterClass}` : toasterClass}
            key={t.id}
          >
            {t.type === 'custom' ? (
              resolveValue(t.message, t)
            ) : children ? (
              children(t)
            ) : (
              <ToastBar toast={t} position={toastPosition} />
            )}
          </div>
        );
      })}
    </div>
  );
};
