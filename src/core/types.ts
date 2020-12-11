export type ToastType = 'success' | 'error' | 'loading' | 'blank';

export type Renderable = JSX.Element | string | number | null;

export interface Toast {
  type: ToastType;
  id: string;
  message: Renderable;
  icon?: Renderable;
  duration: number;

  createdAt: number;
  visible: boolean;
  height?: number;
}
