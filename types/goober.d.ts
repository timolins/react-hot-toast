import * as goober from 'goober';
import { Theme } from '../src/core/types';

declare module 'goober' {
  interface Context {
    resource: any;
  }
  function keyframes(
    tag: CSSAttribute | TemplateStringsArray | string,
    ...props: Array<string | number>
  ): string;

  export interface DefaultTheme {
    colors: {
      background: string;
      text: string;
      success: string;
      error: string;
    };
  }
}
