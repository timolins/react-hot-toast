import * as React from 'react';
import { styled } from 'goober';

import { Renderable, ToastType } from '../core/types';
import { ErrorIndicator } from './error';
import { Loader } from './loader';
import { Checkmark } from './checkmark';
import { IconWrapper } from './icon-wrapper';

const StatusWrapper = styled('div')`
  position: absolute;
`;

const IndicatorWrapper = styled('div')`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
`;

interface ConnectionProps {
  type?: ToastType;
  icon?: Renderable;
}

export const Indicator: React.FC<ConnectionProps> = ({ type, icon }) => {
  if (icon !== undefined) {
    if (typeof icon === 'string') {
      return <IconWrapper>{icon}</IconWrapper>;
    } else {
      return <IndicatorWrapper>{icon}</IndicatorWrapper>;
    }
  }

  if (type === 'blank') {
    return null;
  }

  return (
    <IndicatorWrapper>
      <Loader />
      {type !== 'loading' && (
        <StatusWrapper>
          {type === 'error' ? <ErrorIndicator /> : <Checkmark />}
        </StatusWrapper>
      )}
    </IndicatorWrapper>
  );
};
