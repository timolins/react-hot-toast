import * as React from 'react';
import { styled } from 'goober';

import { ToastType } from '../core/types';
import { ErrorIcon, ErrorTheme } from './error';
import { LoaderIcon, LoaderTheme } from './loader';
import { CheckmarkIcon, CheckmarkTheme } from './checkmark';

const StatusWrapper = styled('div')`
  position: absolute;
`;

export const IndicatorWrapper = styled('div')`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
`;

export type IndicatorTheme = Partial<{
  success: CheckmarkTheme;
  error: ErrorTheme;
  loading: LoaderTheme;
}>;

interface IndicatorProps {
  type: ToastType;
  theme?: IndicatorTheme;
}

export const Indicator: React.FC<IndicatorProps> = ({ type, theme }) => {
  if (type === 'blank') {
    return null;
  }

  return (
    <IndicatorWrapper>
      <LoaderIcon {...theme?.success} />
      {type !== 'loading' && (
        <StatusWrapper>
          {type === 'error' ? (
            <ErrorIcon {...theme?.error} />
          ) : (
            <CheckmarkIcon {...theme?.success} />
          )}
        </StatusWrapper>
      )}
    </IndicatorWrapper>
  );
};
