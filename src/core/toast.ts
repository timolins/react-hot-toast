import {
  Renderable,
  Toast,
  ToastOptions,
  ToastType,
  DefaultToastOptions,
  ValueOrFunction,
  resolveValue,
} from './types';
import { genId } from './utils';
import { createDispatch, Action, ActionType, dispatchAll } from './store';

type Message = ValueOrFunction<Renderable, Toast>;

type ToastHandler = (message: Message, options?: ToastOptions) => string;

const createToast = (
  message: Message,
  type: ToastType = 'blank',
  opts?: ToastOptions
): Toast => ({
  createdAt: Date.now(),
  visible: true,
  type,
  ariaProps: {
    role: 'status',
    'aria-live': 'polite',
  },
  message,
  pauseDuration: 0,
  ...opts,
  id: opts?.id || genId(),
});

const createHandler =
  (type?: ToastType): ToastHandler =>
  (message, options) => {
    const toast = createToast(message, type, options);
    const dispatch = createDispatch(toast.toasterId);
    dispatch({ type: ActionType.UPSERT_TOAST, toast });
    return toast.id;
  };

const toast = (message: Message, opts?: ToastOptions) =>
  createHandler('blank')(message, opts);

toast.error = createHandler('error');
toast.success = createHandler('success');
toast.loading = createHandler('loading');
toast.custom = createHandler('custom');

/**
 * Dismisses the toast with the given id. If no id is given, dismisses all toasts.
 * The toast will transition out and then be removed from the DOM.
 * Applies to all toasters, except when a `toasterId` is given.
 */
toast.dismiss = (toastId?: string, toasterId?: string) => {
  const action: Action = {
    type: ActionType.DISMISS_TOAST,
    toastId,
  };

  if (toasterId) {
    createDispatch(toasterId)(action);
  } else {
    dispatchAll(action);
  }
};

/**
 * Removes the toast with the given id. If no id is given, removes all toasts.
 * The toast will be removed from the DOM without any transition.
 */
toast.remove = (toastId?: string, toasterId?: string) => {
  const action: Action = {
    type: ActionType.REMOVE_TOAST,
    toastId,
  };
  if (toasterId) {
    createDispatch(toasterId)(action);
  } else {
    dispatchAll(action);
  }
};

/**
 * Create a loading toast that will automatically updates with the promise.
 */
toast.promise = <T>(
  promise: Promise<T>,
  msgs: {
    loading: Renderable;
    success: ValueOrFunction<Renderable, T>;
    error: ValueOrFunction<Renderable, any>;
  },
  opts?: DefaultToastOptions
) => {
  const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading });

  promise
    .then((p) => {
      toast.success(resolveValue(msgs.success, p), {
        id,
        ...opts,
        ...opts?.success,
      });
      return p;
    })
    .catch((e) => {
      toast.error(resolveValue(msgs.error, e), {
        id,
        ...opts,
        ...opts?.error,
      });
    });

  return promise;
};

export { toast };
