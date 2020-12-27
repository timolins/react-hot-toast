import * as React from 'react';
import { useCallback } from 'react';
import { css, styled, keyframes, CSSAttribute } from 'goober';

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

const ToastBarBase = (() => {
  interface Style {
    [propertyName: string]: string | any;
  }
  interface ToastBarBaseProps {
    className?: String;
    children?: JSX.Element | JSX.Element[];
    style?: Style;
  }
  const DEFAULT_STYLING = {
    display: 'flex',
    alignItems: 'center',
    background: '#fff', // rather backgroundColor
    color: '#363636',
    lineHeight: '1.3',
    willChange: 'transform',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
    maxWidth: 350,
    margin: 16,
    pointerEvents: 'auto',
    padding: '8px 10px',
    borderRadius: 8,
  };

  return React.forwardRef(
    (
      { className, children, style = {}, ...rest }: ToastBarBaseProps,
      ref?: React.Ref<HTMLDivElement>
    ): JSX.Element => {
      const sanitizedStyle = Object.entries(DEFAULT_STYLING).reduce(
        (acc, [prop, val]) => ({ ...acc, [prop]: style[prop] ?? val }),
        { style } // ensures that additional CSS properties are added!
      );
      const cls = [css(sanitizedStyle), className].filter((x) => x).join(' ');

      return <div ref={ref} {...rest} className={cls} children={children} />;
    }
  );
})();

const Message = styled('div')`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1;
`;

interface ToastBarProps {
  toast: Toast;
  offset: number;
  onHeight: (height: number) => void;

  position: ToastPosition;
}

const getPositionStyle = (
  position: ToastPosition,
  offset: number
): React.CSSProperties => {
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
  return {
    position: 'fixed',
    transition: 'all 230ms cubic-bezier(.21,1.02,.73,1)',
    transform: `translateY(${offset * (top ? 1 : -1)}px)`,
    ...verticalStyle,
    ...horizontalStyle,
  };
};

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
  ({ toast, position, ...props }) => {
    const ref = useCallback((el: HTMLElement | null) => {
      if (el) {
        const boundingRect = el.getBoundingClientRect();
        props.onHeight(boundingRect.height);
      }
    }, []);

    const positionStyle = getPositionStyle(position, props.offset);
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
      <div
        style={{
          display: 'flex',
          zIndex: toast.visible ? 9999 : undefined,
          ...positionStyle,
        }}
      >
        <ToastBarBase
          ref={ref}
          className={toast.className}
          style={{ ...animationStyle, ...toast.style }}
        >
          {renderIcon()}
          <Message role={toast.role} aria-live={toast.ariaLive}>
            {resolveValueOrFunction(toast.message, toast)}
          </Message>
        </ToastBarBase>
      </div>
    );
  }
);
