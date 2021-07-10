import { ValueFunction, ValueOrFunction } from "./types";

export const genId = (() => {
  let count = 0;
  return () => {
    return (++count).toString();
  };
})();

export const createRectRef = (onRect: (rect: DOMRect) => void) => (
  el: HTMLElement | null
) => {
  if (el) {
    setTimeout(() => {
      const boundingRect = el.getBoundingClientRect();
      onRect(boundingRect);
    });
  }
};

export const prefersReducedMotion = (() => {
  // Cache result
  let shouldReduceMotion: boolean | undefined = undefined;

  return () => {
    if (shouldReduceMotion === undefined) {
      const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
      shouldReduceMotion = !mediaQuery || mediaQuery.matches;
    }
    return shouldReduceMotion;
  };
})();

const isFunction = <TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>
): valOrFunction is ValueFunction<TValue, TArg> =>
  typeof valOrFunction === 'function';

export const resolveValue = <TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>,
  arg: TArg
): TValue => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction);
