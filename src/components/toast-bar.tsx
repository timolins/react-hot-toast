import * as React from 'react';
import { useCallback } from 'react';
import { styled, keyframes } from 'goober';

import { Toast, ToastPosition, resolveValueOrFunction } from '../core/types';
import { Indicator } from './indicator';
import { AnimatedIconWrapper } from './icon-wrapper';

const enterAnimation = (factor: number) => `
0% {transform: translate3d(0,${factor * -80}px,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`;

const exitAnimation = (factor: number) => `
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${factor * -130}px,-1px) scale(.5); opacity:0;}
`;

const ToastBarBase = styled('div', React.forwardRef)`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  margin: 16px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`;

const Message = styled('div')`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1;
`;

interface ToastBarProps {
  toast: Toast;
  onHeight: (height: number) => void;

  position: ToastPosition;
}

const getAnimationStyle = (
  position: ToastPosition,
  visible: boolean
): React.CSSProperties => {
  const top = position.includes('top');
  const factor = top ? 1 : -1;
  return visible
    ? {
        animation: `${keyframes`${enterAnimation(
          factor
        )}`} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`,
      }
    : {
        animation: `${keyframes`${exitAnimation(
          factor
        )}`} 0.8s forwards cubic-bezier(.06,.71,.55,1)`,
        pointerEvents: 'none',
      };
};

export const ToastBar: React.FC<ToastBarProps> = React.memo(
  ({ toast, position, onHeight }) => {
    const ref = useCallback((el: HTMLElement | null) => {
      if (el) {
        setTimeout(() => {
          const boundingRect = el.getBoundingClientRect();
          onHeight(boundingRect.height);
        });
      }
    }, []);

    const animationStyle = toast?.height
      ? getAnimationStyle(position, toast.visible)
      : { opacity: 0 };

    const renderIcon = () => {
      const { icon, type, iconTheme } = toast;
      if (icon !== undefined) {
        if (typeof icon === 'string') {
          return <AnimatedIconWrapper>{icon}</AnimatedIconWrapper>;
        } else {
          return icon;
        }
      }

      return <Indicator theme={iconTheme} type={type} />;
    };

    return (
      <ToastBarBase
        ref={ref}
        className={toast.className}
        style={{
          ...animationStyle,
          ...toast.style,
        }}
      >
        {renderIcon()}
        <Message role={toast.role} aria-live={toast.ariaLive}>
          {resolveValueOrFunction(toast.message, toast)}
        </Message>
      </ToastBarBase>
    );
  }
);
