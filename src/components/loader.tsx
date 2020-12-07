import { styled, keyframes } from 'goober';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Loader = styled('div')<{
  big?: boolean;
}>`
  width: 8px;
  height: 8px;
  border: 2px solid;
  border-radius: 100%;
  border-color: #e0e0e0;
  border-right-color: #616161;
  animation: ${rotate} 1s linear infinite;
`;
