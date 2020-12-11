import * as React from 'react';
import { styled } from 'goober';

import { Renderable, ToastType } from '../core/types';
import { ErrorIndicator } from './error';
import { Loader } from './loader';
import { Checkmark } from './checkmark';
import { IconWrapper } from './icon-wrapper';

const StatusWrapper = styled('div')`
  position: absolute;
  left: -4px;
  top: -4px;
`;

const IndicatorWrapper = styled('div')`
  position: relative;
  margin-right: 6px;
`;

interface ConnectionProps {
  type?: ToastType;
  icon?: Renderable;
}

export const Indicator: React.FC<ConnectionProps> = ({ type, icon }) => {
  if (icon !== undefined) {
    return <IconWrapper>{icon}</IconWrapper>;
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
