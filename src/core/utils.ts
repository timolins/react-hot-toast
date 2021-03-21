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
