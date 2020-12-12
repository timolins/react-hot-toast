import * as React from 'react';
import { useCallback } from 'react';
import { Properties } from 'csstype';
import { styled, keyframes, CSSAttribute } from 'goober';

import { usePreserve } from '../core/use-preserve';
import { Toast, ToastPosition } from '../core/types';
import { Indicator, IndicatorTheme, IndicatorWrapper } from './indicator';
import { AnimatedIconWrapper } from './icon-wrapper';

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
  background: #fff;
  color: #363636;
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
  iconTheme?: IndicatorTheme;
}

export const ToastBar: React.FC<ToastBarProps> = React.memo(
  ({ toast, position, ...props }) => {
    const prevToast = usePreserve(toast);

    const ref = useCallback((el: HTMLElement | null) => {
      if (el) {
        const boundingRect = el.getBoundingClientRect();
        props.onHeight(boundingRect.height);
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

    const renderIcon = () => {
      const { icon } = prevToast;
      if (icon !== undefined) {
        if (typeof icon === 'string') {
          return <AnimatedIconWrapper>{icon}</AnimatedIconWrapper>;
        } else {
          return <IndicatorWrapper>{icon}</IndicatorWrapper>;
        }
      }

      return (
        <Indicator
          theme={{ ...props.iconTheme, ...prevToast.iconTheme }}
          type={prevToast.type}
        />
      );
    };

    return (
      <div
        style={{
          position: 'fixed',
          display: 'flex',
          ...horizontalStyle,
          ...verticalStyle,
          transition: 'all 230ms cubic-bezier(.21,1.02,.73,1)',
          transform: `translateY(${props.offset * (top ? 1 : -1)}px)`,
          zIndex: props.zIndex === false ? undefined : props.zIndex,
        }}
      >
        <ToastBarBase
          ref={ref}
          className={props.className}
          style={{
            ...animationStyle,
            ...props.style,
            ...toast.style,
          }}
        >
          {renderIcon()}
          <Message role={prevToast.role} aria-live={prevToast.ariaLive}>
            {prevToast.message}
          </Message>
        </ToastBarBase>
      </div>
    );
  }
);
