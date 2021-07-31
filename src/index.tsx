import { toast } from './core/toast';

// Type re-export workaround, to stay compatible with TS 3.7 and lower
import {
  ToastOptions as _ToastOptions,
  ToastPosition as _ToastPosition,
  Toast as _Toast,
} from './core/types';
export { useToaster } from './core/use-toaster';
export { ToastBar } from './components/toast-bar';
export { ToastIcon } from './components/toast-icon';
export { Toaster } from './components/toaster';
export { useStore as useToasterStore } from './core/store';
export { CheckmarkIcon } from './components/checkmark';
export { ErrorIcon } from './components/error';
export { LoaderIcon } from './components/loader';
export { resolveValue } from './core/types';

export type ToastOptions = _ToastOptions;
export type ToastPosition = _ToastPosition;
export type Toast = _Toast;

export { toast };
export default toast;
