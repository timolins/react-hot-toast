import {
  Renderable,
  Toast,
  ToastOptions,
  ToastType,
  DefaultToastOptions,
  ValueOrFunction,
  resolveValueOrFunction,
} from './types';
import { genId } from './utils';
import { dispatch, ActionType } from './store';

type Message = ValueOrFunction<Renderable, Toast>;

type ToastHandler = (message: Message, options?: ToastOptions) => string;

const createToast = (
  message: Message,
  type: ToastType = 'blank',
  opts?: ToastOptions
): Toast => ({
  id: opts?.id || genId(),
  createdAt: Date.now(),
  visible: true,
  type,
  role: 'status',
  ariaLive: 'polite',
  message,
  pauseDuration: 0,
  ...opts,
});

const createHandler = (type?: ToastType): ToastHandler => (
  message,
  options
) => {
  const toast = createToast(message, type, options);
  dispatch({ type: ActionType.UPSERT_TOAST, toast });
  return toast.id;
};

const toast = (message: Message, opts?: ToastOptions) =>
  createHandler('blank')(message, opts);

toast.error = createHandler('error');
toast.success = createHandler('success');
toast.loading = createHandler('loading');

toast.dismiss = (toastId?: string) => {
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

toast.remove = (toastId?: string) =>
  dispatch({ type: ActionType.REMOVE_TOAST, toastId });

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
      toast.success(resolveValueOrFunction(msgs.success, p), {
        id,
        ...opts,
        ...opts?.success,
      });
      return p;
    })
    .catch((e) => {
      toast.error(resolveValueOrFunction(msgs.error, e), {
        id,
        ...opts,
        ...opts?.error,
      });
    });

  return promise;
};

export { toast };
