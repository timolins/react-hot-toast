import * as React from 'react';
import { useCallback } from 'react';
import { Properties } from 'csstype';
import { styled, keyframes, CSSAttribute } from 'goober';

import { usePreserve } from '../core/use-preserve';
import { Toast, ToastPosition } from '../core/types';
import { Indicator } from './indicator';

const enterAnimation = (reverse: boolean) => `
0% {transform: translate3d(0,${
  (reverse ? -1 : 1) * -80
}px,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`;

const exitAnimation = (reverse: boolean) => `
0% {transform: translate3d(0,0,0) scale(1); opacity:1;}
100% {transform: translate3d(0,${
  (reverse ? -1 : 1) * -130
}px, 0) scale(.5); opacity:0;}
`;

const ToastBarBase = styled('div', React.forwardRef)`
  display: flex;
  align-items: center;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
  text-align: center;
  line-height: 1.3;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 300px;
  margin: 8px;
  pointer-events: auto;
  padding: 6px 8px;
  border-radius: 8px;
`;

const Message = styled('p')`
  margin: 4px 10px;
  color: inherit;
  flex: 1;
`;

interface ToastBarProps {
  toast: Toast;
  offset: number;
  position: ToastPosition;
  zIndex: number | false;
  onHeight: (height: number) => void;

  style?: Properties;
  className?: string;
}

export const ToastBar: React.FC<ToastBarProps> = React.memo(
  ({ toast, onHeight, offset, position, style, zIndex, className }) => {
    const prevToast = usePreserve(toast);

    const ref = useCallback((el: HTMLElement | null) => {
      if (el) {
        const boundingRect = el.getBoundingClientRect();
        onHeight(boundingRect.height);
      }
    }, []);

    if (!prevToast) {
      return null;
    }

    const top = position.includes('top');
    const verticalStyle = top ? { top: 0 } : { bottom: 0 };
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

    const animationStyle: Properties = prevToast?.height
      ? prevToast.visible
        ? {
            animation: `${keyframes`${enterAnimation(
              !top
            )}`} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`,
          }
        : {
            animation: `${keyframes`${exitAnimation(
              !top
            )}`} 0.8s forwards cubic-bezier(.06,.71,.55,1)`,
            pointerEvents: 'none',
          }
      : { opacity: 0 };

    return (
      <div
        style={{
          position: 'fixed',
          display: 'flex',
          ...horizontalStyle,
          ...verticalStyle,
          transition: 'all 230ms cubic-bezier(.21,1.02,.73,1)',
          transform: `translateY(${offset * (top ? 1 : -1)}px)`,
          zIndex: zIndex === false ? undefined : zIndex,
        }}
      >
        <ToastBarBase
          ref={ref}
          className={className}
          style={{
            ...animationStyle,
            ...style,
            ...toast.style,
          }}
        >
          <Indicator icon={prevToast.icon} type={prevToast.type} />
          <Message role={prevToast.role} aria-live={prevToast.ariaLive}>
            {prevToast.message}
          </Message>
        </ToastBarBase>
      </div>
    );
  }
);
