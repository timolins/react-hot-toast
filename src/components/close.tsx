import { styled } from 'goober';

export interface CloseTheme {
	primary?: string;
	secondary?: string;
}

export const CloseIcon = styled('div')<CloseTheme>`
  width: 20px;
  opacity: 1;
  height: 20px;
  border-radius: 10px;
  background:  ${(p) => p.primary || 'transparent'};;
  position: relative;
  transform: rotate(45deg);
	transition: background-color 200ms ease-out;

  &:after,
  &:before {
    content: '';
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 1;
    background: ${(p) => p.secondary || '#000'};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    transform: rotate(90deg);
  }
`;
