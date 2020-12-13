import { Renderable, Toast, ToastType } from './types';
import { genId } from './utils';
import { dispatch, ActionType } from './store';

const defaultTimeouts: Map<ToastType, number> = new Map<ToastType, number>([
  ['blank', 4000],
  ['error', 4000],
  ['success', 2000],
  ['loading', 30000],
]);

export type ToastOptions = Partial<
  Pick<
    Toast,
    | 'id'
    | 'icon'
    | 'duration'
    | 'role'
    | 'ariaLive'
    | 'className'
    | 'style'
    | 'iconTheme'
  >
>;

type ToastHandler = (message: Renderable, options?: ToastOptions) => string;

const createToast = (
  message: Renderable,
  type: ToastType = 'blank',
  opts?: ToastOptions
): Toast => ({
  id: opts?.id || genId(),
  createdAt: Date.now(),
  visible: true,
  type,
  role: 'status',
  ariaLive: 'polite',
  duration: defaultTimeouts.get(type) || 4000,
  message,
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

const toast = (message: Renderable, opts?: ToastOptions) =>
  createHandler('blank')(message, opts);

toast.error = createHandler('error');
toast.success = createHandler('success');
toast.loading = createHandler('loading');

toast.dismiss = (toastId?: string) =>
  dispatch({ type: ActionType.DISMISS_TOAST, toastId });
toast.remove = (toastId?: string) =>
  dispatch({ type: ActionType.REMOVE_TOAST, toastId });

toast.promise = <T>(
  promise: Promise<T>,
  msgs: {
    loading: Renderable;
    success: Renderable | ((result: T) => Renderable);
    error: Renderable | ((reason: any) => Renderable);
  },
  opts?: {
    loading?: ToastOptions;
    success?: ToastOptions;
    error?: ToastOptions;
  }
) => {
  const id = toast.loading(msgs.loading, opts?.loading);

  promise
    .then((p) => {
      toast.success(
        typeof msgs.success === 'function' ? msgs.success(p) : msgs.success,
        {
          id,
          ...opts?.success,
        }
      );
      return p;
    })
    .catch((e) => {
      toast.error(
        typeof msgs.error === 'function' ? msgs.error(e) : msgs.error,
        {
          id,
          ...opts?.error,
        }
      );
    });

  return promise;
};

export { toast };
