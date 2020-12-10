import * as React from 'react';
import { useCallback } from 'react';
import { styled, keyframes, CSSAttribute } from 'goober';

import { usePreserve } from '../core/use-preserve';
import { InternalStatus, StatusType } from '../status';
import { Indicator } from './indicator';

const StatusBarWrapper = styled('div')`
  position: fixed;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
`;

const enterSpring = `
0% {transform: translate3d(0,-80px,0) scale(0.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`;

const enterAnimation: CSSAttribute = {
  zIndex: 2,
  animation: `${keyframes`${enterSpring}`} forwards`,
  animationDuration: '0.3s',
  animationTimingFunction: 'cubic-bezier(.21,1.02,.73,1)',
};

const exitSpring = `
0% {transform: translate3d(0, 0, 0) scale(1); opacity: 1;}
100% {transform: translate3d(0,-130px, 0) scale(0.5); opacity: 0;}
`;

const exitAnimation: CSSAttribute = {
  animation: `${keyframes`${exitSpring}`} 0.5s forwards cubic-bezier(.06,.71,.55,1)`,
};

// Animated
const StatusBarBase = styled('div', React.forwardRef)`
  display: flex;
  position: absolute;
  align-items: center;
  background: white;
  max-width: 300px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  padding: 6px 12px;
  margin-top: 20px;
  border-radius: 8px;
`;

const IndicatorWrapper = styled('div')`
  /* display: absolute; */
`;

const Message = styled('p')`
  margin: 4px;
  margin-left: 10px;
  color: #363636;
  flex: 1;
  text-align: center;
`;

const firstLineAnimation = keyframes`
  from {
    transform: scale(0.6);
	 opacity: 0.4;
  }

  to {
    transform: scale(1);
	 opacity: 1;
  }
`;

const CustomIndicator = styled('div')`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  animation: ${firstLineAnimation} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 0.12s;
`;

interface StatusBarProps {
  status: InternalStatus;
  offset: number;
  onHeight: (height: number) => void;
}

export const StatusBar: React.FC<StatusBarProps> = React.memo(
  ({ status, onHeight, offset }) => {
    const persStatus = usePreserve(status);

    const ref = useCallback((el: HTMLElement | null) => {
      if (el) {
        const boundingRect = el.getBoundingClientRect();
        onHeight(boundingRect.height);
      }
    }, []);

    return (
      <div>
        <StatusBarWrapper
          key="status-bar"
          style={{
            transition: 'all 200ms cubic-bezier(0.59,0,0.5,1.15)',
            transform: `translateY(${offset}px)`,
          }}
        >
          <StatusBarBase
            ref={ref}
            style={
              persStatus?.height
                ? persStatus.visible
                  ? enterAnimation
                  : exitAnimation
                : { opacity: 0 }
            }
          >
            <IndicatorWrapper>
              {persStatus?.type === StatusType.Custom ? (
                <CustomIndicator>🔥</CustomIndicator>
              ) : (
                <Indicator statusType={persStatus?.type} delay={100} />
              )}
            </IndicatorWrapper>
            <Message role="alert" aria-live="polite">
              {persStatus?.message} {persStatus?.id}
            </Message>
          </StatusBarBase>
        </StatusBarWrapper>
      </div>
    );
  }
);
