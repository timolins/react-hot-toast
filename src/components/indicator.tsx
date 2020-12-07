import * as React from 'react';
import { styled } from 'goober';

import { StatusType } from '../status';
import { ErrorIndicator } from './error';
import { Loader } from './loader';
import { Checkmark } from './checkmark';

const StatusWrapper = styled('div')`
  position: absolute;
  left: -4px;
  top: -4px;
`;

const IndicatorWrapper = styled('div')`
  position: relative;
`;

interface ConnectionProps {
  statusType?: StatusType;
  done?: boolean;
  delay?: number;
}

export const Indicator: React.FC<ConnectionProps> = ({
  statusType,
  done,
  delay,
}) => {
  const notLoading =
    (statusType !== undefined && statusType !== StatusType.Loading) || done;

  return (
    <IndicatorWrapper>
      <Loader />
      {notLoading && (
        <StatusWrapper>
          {statusType === StatusType.Error ? (
            <ErrorIndicator delay={delay} />
          ) : (
            <Checkmark delay={delay} />
          )}
        </StatusWrapper>
      )}
    </IndicatorWrapper>
  );
};
