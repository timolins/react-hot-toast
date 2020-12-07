import * as React from 'react';
import { useRef } from 'react';
// import { animated, useTransition } from 'react-spring/web';

import { styled, keyframes, CSSAttribute } from 'goober';
import { Indicator } from './indicator';
import { StatusType } from '../status';

const StatusBarWrapper = styled('div')`
  position: fixed;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
`;
// Animations generated with: https://rawgit.com/sktt/springish-css/master/index.html
// Enter
// A: -80, k: 200, damping: 12
// (val) => `transform: translate3d(0, ${val}px, 0) scale(${Number(val)/250 + 1}); opacity: ${Number(val)/160 + 1}`

// const enterSpring = `
// 0.00% {transform: translate3d(0, -80.00px, 0) scale(0.67999); opacity: 0.5;}
// 40.27% {transform: translate3d(0, 1.42px, 0) scale(1.00568); opacity: 1.008875;}
// 100.00% {transform: translate3d(0, -0.01px, 0) scale(1); opacity: 1;}
// `;

// const enterAnimation: CSSAttribute = {
//   animation: `${keyframes`${enterSpring}`} forwards`,
//   animationDuration: '0.7s',
//   animationTimingFunction: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
// };

// Animations generated with: https://rawgit.com/sktt/springish-css/master/index.html
// Enter
// A: -80, k: 200, damping: 12
// (val) => `transform: translate3d(0, ${val}px, 0) scale(${Number(val)/250 + 1}); opacity: ${Number(val)/160 + 1}`

// const enterSpring = `
// 0.00% {transform: translate3d(0, -80.00px, 0) scale(0.67999); opacity: 0.5;}
// 40.27% {transform: translate3d(0, 1.42px, 0) scale(1.00568); opacity: 1.008875;}
// 100.00% {transform: translate3d(0, -0.01px, 0) scale(1); opacity: 1;}
// `;

// const enterAnimation: CSSAttribute = {
//   animation: `${keyframes`${enterSpring}`} forwards`,
//   animationDuration: '0.7s',
//   animationTimingFunction: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
// };

const enterSpring = `
0% {transform: translate3d(0,-80px,0) scale(0.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`;

const enterAnimation: CSSAttribute = {
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
const StatusBarBase = styled('div')`
  display: flex;
  position: absolute;
  align-items: center;
  width: 2;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  padding: 6px 12px;
  margin-top: 20px;
  border-radius: 8px;
`;

const IndicatorWrapper = styled('div')`
  display: absolute;
`;

const Message = styled('div')`
  margin: 4px;
  margin-left: 10px;
  color: #363636;
  flex: 1;
  text-align: center;
`;

interface Status {
  type: StatusType;
  message: string;
}

interface StatusBarProps {
  status?: Status;
  visible: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = React.memo((props) => {
  const prevStatus = useRef<Status>();

  const status = props.status || prevStatus.current;

  if (props.status) {
    prevStatus.current = props.status;
  }

  const visible = !!props.status;

  return (
    <StatusBarWrapper key="status-bar">
      <StatusBarBase style={visible ? enterAnimation : exitAnimation}>
        <IndicatorWrapper>
          <Indicator
            statusType={status ? status.type : undefined}
            delay={100}
          />
        </IndicatorWrapper>
        <Message>{status && status.message}</Message>
      </StatusBarBase>
    </StatusBarWrapper>
  );
});
