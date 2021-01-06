import { dispatch, ActionType } from './store';

export const genId = (() => {
  let count = 0;
  return () => {
    return (++count).toString();
  };
})();

export const dismissToast = (toastId?: string) => {
  dispatch({
    type: ActionType.DISMISS_TOAST,
    toastId,
  });
  setTimeout(() => {
    dispatch({
      type: ActionType.REMOVE_TOAST,
      toastId,
    });
  }, 1000);
};
