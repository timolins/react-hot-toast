import { styled, keyframes } from 'goober';

const enter = keyframes`
from {
  transform: scale(0.6);
  opacity: 0.4;
}

to {
  transform: scale(1);
  opacity: 1;
}
`;

export const AnimatedIconWrapper = styled('div')`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${enter} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`;
