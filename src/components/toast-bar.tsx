import * as React from 'react';
import { styled } from 'goober';

import { Toast, ToastPosition, resolveValue, Renderable } from '../core/types';
import { ToastIcon } from './toast-icon';
import { prefersReducedMotion } from '../core/utils';

// Use :where() for zero specificity - allows Tailwind to override easily
const ToastBarBase = styled('div')`
  :where(&) {
    display: flex;
    align-items: center;
    background: #fff;
    color: #363636;
    line-height: 1.3;
    will-change: transform;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
    max-width: 350px;
    pointer-events: auto;
    padding: 8px 10px;
    border-radius: 8px;
  }

  @keyframes rht-enter-from-top {
    0% { transform: translate3d(0, -200%, 0) scale(.6); opacity: .5; }
    100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
  }

  @keyframes rht-enter-from-bottom {
    0% { transform: translate3d(0, 200%, 0) scale(.6); opacity: .5; }
    100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
  }

  @keyframes rht-exit-to-top {
    0% { transform: translate3d(0, 0, -1px) scale(1); opacity: 1; }
    100% { transform: translate3d(0, -150%, -1px) scale(.6); opacity: 0; }
  }

  @keyframes rht-exit-to-bottom {
    0% { transform: translate3d(0, 0, -1px) scale(1); opacity: 1; }
    100% { transform: translate3d(0, 150%, -1px) scale(.6); opacity: 0; }
  }

  @keyframes rht-fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes rht-fade-out {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  &.rht-enter-from-top {
    animation: rht-enter-from-top 0.35s cubic-bezier(.21,1.02,.73,1) forwards;
  }

  &.rht-enter-from-bottom {
    animation: rht-enter-from-bottom 0.35s cubic-bezier(.21,1.02,.73,1) forwards;
  }

  &.rht-exit-to-top {
    animation: rht-exit-to-top 0.4s forwards cubic-bezier(.06,.71,.55,1);
  }

  &.rht-exit-to-bottom {
    animation: rht-exit-to-bottom 0.4s forwards cubic-bezier(.06,.71,.55,1);
  }

  &.rht-fade-in {
    animation: rht-fade-in 0.35s cubic-bezier(.21,1.02,.73,1) forwards;
  }

  &.rht-fade-out {
    animation: rht-fade-out 0.4s forwards cubic-bezier(.06,.71,.55,1);
  }

  &.rht-invisible {
    opacity: 0;
  }

  &.rht-success {
    background: var(--rht-success-bg, #ecfdf5);
    color: var(--rht-success-fg, #065f46);
  }

  &.rht-error {
    background: var(--rht-error-bg, #fef2f2);
    color: var(--rht-error-fg, #991b1b);
  }

  &.rht-loading {
    background: var(--rht-loading-bg, #fff);
    color: var(--rht-loading-fg, #363636);
  }

  &.rht-blank {
    background: var(--rht-blank-bg, #fff);
    color: var(--rht-blank-fg, #363636);
  }
`;

const Message = styled('div')`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;

interface ToastBarProps {
  toast: Toast;
  position?: ToastPosition;
  style?: React.CSSProperties;
  strictCSP?: boolean;
  children?: (components: {
    icon: Renderable;
    message: Renderable;
  }) => Renderable;
}

const getAnimationClass = (
  position: ToastPosition,
  visible: boolean,
  hasHeight: boolean
): string => {
  if (!hasHeight) {
    return 'rht-invisible';
  }

  const top = position.includes('top');
  const reduced = prefersReducedMotion();

  if (reduced) {
    return visible ? 'rht-fade-in' : 'rht-fade-out';
  }

  if (visible) {
    return top ? 'rht-enter-from-top' : 'rht-enter-from-bottom';
  }

  return top ? 'rht-exit-to-top' : 'rht-exit-to-bottom';
};

export const ToastBar: React.FC<ToastBarProps> = React.memo(
  ({ toast, position, style, strictCSP, children }) => {
    const animationClass = getAnimationClass(
      toast.position || position || 'top-center',
      toast.visible,
      !!toast.height
    );

    const icon = <ToastIcon toast={toast} />;
    const message = (
      <Message {...toast.ariaProps}>
        {resolveValue(toast.message, toast)}
      </Message>
    );

    const className = [
      toast.className,
      animationClass,
      toast.type ? `rht-${toast.type}` : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <ToastBarBase
        className={className}
        style={strictCSP ? undefined : {
          ...style,
          ...toast.style,
        }}
      >
        {typeof children === 'function' ? (
          children({
            icon,
            message,
          })
        ) : (
          <>
            {icon}
            {message}
          </>
        )}
      </ToastBarBase>
    );
  }
);
