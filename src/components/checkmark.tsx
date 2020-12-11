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
		height: 0;
		width: 0;
		opacity: 0;
		visibility: visible;
  }

  40% {
		height: 0;
		width: 6px;
		opacity: 1;
  }

  100% {
	visibility: visible;
		height: 10px;
  }
`;

export const Checkmark = styled('div')`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background-color: #61d345;
  position: relative;
  transform: rotate(45deg);

  animation: ${circleAnimation} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    visibility: hidden;
    animation: ${checkmarkAnimation} 0.2s ease-out forwards;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: white;
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`;
