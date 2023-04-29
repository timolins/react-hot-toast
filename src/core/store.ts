import { useEffect, useState } from 'react';
import { DefaultToastOptions, Toast, ToastType } from './types';

// const TOAST_LIMIT = 20;

interface ToasterConfig {
  toastLimit: number;
  dismissDelay: number;
}

export const TOAST_EXPIRE_DISMISS_DELAY = 1000;
export const TOAST_LIMIT = 20;

let baseSettings: ToasterConfig = {
  toastLimit: TOAST_LIMIT,
  dismissDelay: TOAST_EXPIRE_DISMISS_DELAY,
};

export const updateSettings = (
  settings: keyof ToasterConfig,
  value: string | number
) => {
  baseSettings = {
    ...baseSettings,
    [settings]: value,
  };
};

interface BaseSettings {
  toasterId?: string;
  toastLimit?: number;
  dismissDelay?: number;
}

export enum ActionType {
  ADD_TOAST,
  UPDATE_TOAST,
  UPSERT_TOAST,
  DISMISS_TOAST,
  REMOVE_TOAST,
  START_PAUSE,
  END_PAUSE,
}

type Action =
  | {
      type: ActionType.ADD_TOAST;
      toast: Toast;
    }
  | {
      type: ActionType.UPSERT_TOAST;
      toast: Toast;
    }
  | {
      type: ActionType.UPDATE_TOAST;
      toast: Partial<Toast>;
    }
  | {
      type: ActionType.DISMISS_TOAST;
      toastId?: string;
    }
  | {
      type: ActionType.REMOVE_TOAST;
      toastId?: string;
    }
  | {
      type: ActionType.START_PAUSE;
      time: number;
    }
  | {
      type: ActionType.END_PAUSE;
      time: number;
    };

interface ToasterState {
  toasts: Toast[];
  settings: BaseSettings;
  pausedAt: number | undefined;
}

interface State {
  [toasterId: string]: ToasterState;
}
const toastTimeouts = new Map<Toast['id'], ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (
  toastId: string,
  toasterId: string,
  dismissDelay = TOAST_EXPIRE_DISMISS_DELAY
) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    createDispatch(toasterId)({
      type: ActionType.REMOVE_TOAST,
      toastId: toastId,
    });
  }, dismissDelay);

  toastTimeouts.set(toastId, timeout);
};

const clearFromRemoveQueue = (toastId: string) => {
  const taskId = `${toastId}`;
  const timeout = toastTimeouts.get(taskId);
  if (timeout) {
    clearTimeout(timeout);
  }
};

export const reducer = (state: ToasterState, action: Action): ToasterState => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(
          0,
          baseSettings.toastLimit
        ),
      };

    case ActionType.UPDATE_TOAST:
      //  ! Side effects !
      if (action.toast.id) {
        clearFromRemoveQueue(action.toast.id, action.toast.toasterId);
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case ActionType.UPSERT_TOAST:
      const { toast } = action;
      return state.toasts.find((t) => t.id === toast.id)
        ? reducer(state, { type: ActionType.UPDATE_TOAST, toast })
        : reducer(state, { type: ActionType.ADD_TOAST, toast });

    case ActionType.DISMISS_TOAST:
      const { toastId, toasterId } = action;

      // ! Side effects ! - This could be execrated into a dismissToast() action, but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId, toastId, state.settings.dismissDelay);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(
            toast.id,
            toast.toasterId,
            state.settings.dismissDelay
          );
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                visible: false,
              }
            : t
        ),
      };
    case ActionType.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    case ActionType.START_PAUSE:
      return {
        ...state,
        pausedAt: action.time,
      };

    case ActionType.END_PAUSE:
      const diff = action.time - (state.pausedAt || 0);

      return {
        ...state,
        pausedAt: undefined,
        toasts: state.toasts.map((t) => ({
          ...t,
          pauseDuration: t.pauseDuration + diff,
        })),
      };
  }
};

const listeners: Array<
  [toasterId: string, reducer: (state: ToasterState) => void]
> = [];

const defaultToasterId = 'default';
const defaultToasterState: ToasterState = {
  toasts: [],
  pausedAt: undefined,
  settings: {},
};
let memoryState: State = {};

export const createDispatch =
  (toasterId = defaultToasterId) =>
  (action: Action) => {
    memoryState[toasterId] = reducer(
      memoryState[toasterId] || defaultToasterState,
      action
    );
    listeners.forEach(([id, listener]) => {
      if (id === toasterId) {
        listener(memoryState[toasterId]);
      }
    });
  };

export const defaultTimeouts: {
  [key in ToastType]: number;
} = {
  blank: 4000,
  error: 4000,
  success: 2000,
  loading: Infinity,
  custom: 4000,
};

export const useStore = (
  toastOptions: DefaultToastOptions = {},
  toasterId: string = defaultToasterId
): ToasterState => {
  const [state, setState] = useState<ToasterState>(
    memoryState[toasterId] || defaultToasterState
  );
  useEffect(() => {
    listeners.push([toasterId, setState]);
    return () => {
      const index = listeners.findIndex(([id]) => id === toasterId);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  const mergedToasts = state.toasts.map((t) => ({
    ...toastOptions,
    ...toastOptions[t.type],
    ...t,
    duration:
      t.duration ||
      toastOptions[t.type]?.duration ||
      toastOptions?.duration ||
      defaultTimeouts[t.type],
    style: {
      ...toastOptions.style,
      ...toastOptions[t.type]?.style,
      ...t.style,
    },
  }));

  return {
    ...state,
    toasts: mergedToasts,
  };
};
