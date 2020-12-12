import { useEffect, useState } from 'react';
import { Toast } from './types';

const TOAST_LIMIT = 20;

export enum ActionType {
  ADD_TOAST,
  UPDATE_TOAST,
  UPSERT_TOAST,
  DISMISS_TOAST,
  REMOVE_TOAST,
  TOAST,
  ADD_PAUSE,
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
      toast: Toast;
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
      type: ActionType.ADD_PAUSE;
      duration: number;
    };

export const reducer = (queue: Toast[], action: Action): Toast[] => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return [action.toast, ...queue].slice(0, TOAST_LIMIT);

    case ActionType.UPDATE_TOAST:
      return queue.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );

    case ActionType.UPSERT_TOAST:
      const { toast } = action;
      return queue.find((t) => t.id === toast.id)
        ? reducer(queue, { type: ActionType.UPDATE_TOAST, toast })
        : reducer(queue, { type: ActionType.ADD_TOAST, toast });

    case ActionType.DISMISS_TOAST:
      return queue.map((t) =>
        t.id === action.toastId || action.toastId === undefined
          ? {
              ...t,
              visible: false,
            }
          : t
      );
    case ActionType.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return [];
      }
      return queue.filter((t) => t.id !== action.toastId);
    case ActionType.ADD_PAUSE:
      return queue.map((t) => ({
        ...t,
        duration: t.duration + action.duration,
      }));
  }
};

const listeners: Array<(action: Action) => void> = [];
let memoryQueue: Toast[] = [];

export const dispatch = (action: Action) => {
  memoryQueue = reducer(memoryQueue, action);
  listeners.forEach((listener) => {
    listener(action);
  });
};

export const useStore = () => {
  const [queue, setQueue] = useState<Toast[]>(memoryQueue);
  useEffect(() => {
    // In case multiple notifications are submitted in sync
    let actionQueue: Action[] = [];
    const handler = (action: Action) => {
      actionQueue.push(action);
      setQueue(actionQueue.reduce(reducer, queue));
    };
    listeners.push(handler);
    return () => {
      const index = listeners.indexOf(handler);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [queue]);

  return queue;
};
