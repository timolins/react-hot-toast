import { styled, keyframes } from 'goober';

const circleAnimation = keyframes`
  from {
    transform: scale(0) rotate(45deg);
	 opacity: 0;
  }

  to {
    transform: scale(1) rotate(45deg);
	 opacity: 1;
  }
`;

const checkmarkAnimation = keyframes`
  0% {
		height: 0px;
		width: 0px;
		opacity: 0;
		visibility: visible;
  }

  40% {
		height: 0px;
		width: 4px;
		opacity: 1;
  }

  100% {
	visibility: visible;
		height: 8px;
  }
`;

export const Checkmark: any = styled('div')<{ delay?: number }>`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background-color: #61d345;
  position: relative;
  transform: rotate(45deg);

  animation: ${circleAnimation} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: ${(p) => p.delay || 0}ms;
  &:after {
    content: '';
    visibility: hidden;
    animation: ${checkmarkAnimation} 0.2s ease-out forwards;
    animation-delay: ${(p) => (p.delay || 0) + 100}ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: white;
    bottom: 6px;
    left: 6px;
    height: 8px;
    width: 4px;
  }
`;
