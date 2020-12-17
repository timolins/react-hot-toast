import * as React from 'react';
import { styled } from 'goober';

import { ToastType, IconTheme } from '../core/types';
import { ErrorIcon, ErrorTheme } from './error';
import { LoaderIcon, LoaderTheme } from './loader';
import { CheckmarkIcon, CheckmarkTheme } from './checkmark';

const StatusWrapper = styled('div')`
  position: absolute;
`;

const IndicatorWrapper = styled('div')`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`;

export type IconThemes = Partial<{
  success: CheckmarkTheme;
  error: ErrorTheme;
  loading: LoaderTheme;
}>;

interface IndicatorProps {
  type: ToastType;
  theme?: IconTheme;
}

export const Indicator: React.FC<IndicatorProps> = ({ type, theme }) => {
  if (type === 'blank') {
    return null;
  }

  return (
    <IndicatorWrapper>
      <LoaderIcon {...theme} />
      {type !== 'loading' && (
        <StatusWrapper>
          {type === 'error' ? (
            <ErrorIcon {...theme} />
          ) : (
            <CheckmarkIcon {...theme} />
          )}
        </StatusWrapper>
      )}
    </IndicatorWrapper>
  );
};
