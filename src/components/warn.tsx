import { styled, keyframes } from 'goober';

const circleAnimation = keyframes`
from {
  transform: scale(0);
	opacity: 0;
}
to {
  transform: scale(1);
	opacity: 1;
}`;

const lineAnimation = keyframes`
from {
  transform: translateX(-50%) scale(0);
	opacity: 0;
  height: 0;
}
to {
  transform: translateX(-50%) scale(1);
  opacity: 1;
  height: 8px;
}`;

const dotAnimation = keyframes`
from {
  transform: translateX(-50%) scale(0);
	opacity: 0;
  height: 0;
}
to {
  transform: translateX(-50%) scale(1);
  opacity: 1;
  height: 2px;
}`;

export interface WarnTheme {
  primary?: string;
  secondary?: string;
}

export const WarnIcon = styled('div')<WarnTheme>`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 50%;
  background: ${(p) => p.primary || '#ffd00e'};
  position: relative;

  animation: ${circleAnimation} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:before,
  &:after {
    content: '';
    box-sizing: border-box;
    animation-delay: 200ms;
    position: absolute;
    display: block;
    transform: translateX(-50%);
    left: 50%;
    border: solid ${(p) => p.secondary || '#000'};
    border-width: 0 2px 0 0;
    width: 2px;
    opacity: 0;
  }

  &:before {
    top: 4px;
    animation: ${lineAnimation} 0.2s ease-out forwards;
    animation-delay: 150ms;
    border-radius: 3px;
  }

  &:after {
    bottom: 4px;
    animation: ${dotAnimation} 0.2s ease-out forwards;
    animation-delay: 180ms;
    border-radius: 50%;
  }
`;
