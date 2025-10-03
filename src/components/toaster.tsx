import { styled, setup, css } from 'goober';
import * as React from 'react';
import {
  resolveValue,
  ToasterProps,
  ToastPosition,
  ToastWrapperProps,
} from '../core/types';
import { useToaster } from '../core/use-toaster';
import { prefersReducedMotion } from '../core/utils';
import { ToastBar } from './toast-bar';

setup(React.createElement);

const ToastWrapper = ({
  id,
  className,
  style,
  onHeightUpdate,
  children,
}: ToastWrapperProps) => {
  const ref = React.useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        const updateHeight = () => {
          const height = el.getBoundingClientRect().height;
          onHeightUpdate(id, height);
        };
        updateHeight();
        new MutationObserver(updateHeight).observe(el, {
          subtree: true,
          childList: true,
          characterData: true,
        });
      }
    },
    [id, onHeightUpdate]
  );

  return (
    <div ref={ref} className={className} {...(style ? { style } : {})}>
      {children}
    </div>
  );
};

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
const DEFAULT_GUTTER = 8;

const ToasterContainer = styled('div')`
  position: fixed;
  z-index: 9999;
  top: ${DEFAULT_OFFSET}px;
  left: ${DEFAULT_OFFSET}px;
  right: ${DEFAULT_OFFSET}px;
  bottom: ${DEFAULT_OFFSET}px;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: ${DEFAULT_GUTTER}px;

  &[data-position="top-left"],
  &[data-position="top-center"],
  &[data-position="top-right"] {
    align-items: flex-start;
  }

  &[data-position="bottom-left"],
  &[data-position="bottom-center"],
  &[data-position="bottom-right"] {
    align-items: flex-start;
    flex-direction: column-reverse;
  }

  &[data-position="top-center"],
  &[data-position="bottom-center"] {
    align-items: center;
  }

  &[data-position="top-right"],
  &[data-position="bottom-right"] {
    align-items: flex-end;
  }

  > * {
    pointer-events: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

export const Toaster: React.FC<ToasterProps> = ({
  reverseOrder,
  position = 'top-center',
  toastOptions,
  gutter = DEFAULT_GUTTER,
  children,
  toasterId,
  containerStyle,
  containerClassName,
  strictCSP = false,
}) => {
  const { toasts, handlers } = useToaster(toastOptions, toasterId);

  // Sort toasts based on reverseOrder
  const sortedToasts = reverseOrder ? [...toasts].reverse() : toasts;

  // Strict CSP mode: Use styled component with no inline styles
  if (strictCSP) {
    return (
      <ToasterContainer
        data-rht-toaster={toasterId || ''}
        data-position={position}
        className={containerClassName}
        onMouseEnter={handlers.startPause}
        onMouseLeave={handlers.endPause}
      >
        {sortedToasts.map((t) => {
          const toastPosition = t.position || position;

          return (
            <ToastWrapper
              id={t.id}
              key={t.id}
              onHeightUpdate={handlers.updateHeight}
              className=""
            >
              {t.type === 'custom' ? (
                resolveValue(t.message, t)
              ) : children ? (
                children(t)
              ) : (
                <ToastBar toast={t} position={toastPosition} strictCSP />
              )}
            </ToastWrapper>
          );
        })}
      </ToasterContainer>
    );
  }

  // Default mode: Use inline styles for maximum flexibility
  return (
    <div
      data-rht-toaster={toasterId || ''}
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
          <ToastWrapper
            id={t.id}
            key={t.id}
            onHeightUpdate={handlers.updateHeight}
            className={t.visible ? activeClass : ''}
            style={positionStyle}
          >
            {t.type === 'custom' ? (
              resolveValue(t.message, t)
            ) : children ? (
              children(t)
            ) : (
              <ToastBar toast={t} position={toastPosition} />
            )}
          </ToastWrapper>
        );
      })}
    </div>
  );
};
