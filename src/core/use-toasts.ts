import { useEffect, useMemo, useState } from 'react';
import { defaultTimeouts, InternalStatus, StatusType } from '../status';
import { genId } from './utils';

const TOAST_LIMIT = 20;

const addReducer = (queue: InternalStatus[], status: InternalStatus) => {
  if (queue.find((s) => s.id === status.id)) {
    return queue.map((s) => (s.id === status.id ? { ...s, ...status } : s));
  } else {
    return [status, ...queue].slice(0, TOAST_LIMIT);
  }
};

const hideReducer = (queue: InternalStatus[], status: InternalStatus) => {
  return queue.map((s) =>
    s.id === status.id && s.createdAt === status.createdAt
      ? {
          ...status,
          visible: false,
        }
      : s
  );
};

const addPauseReducer = (queue: InternalStatus[], pause: number) => {
  return queue.map((s) => ({
    ...s,
    timeout: s.timeout + pause,
  }));
};

const listeners: Array<(status: InternalStatus) => void> = [];
let memoryQueue: InternalStatus[] = [];

interface NotifyOptions {
  id?: number;
}

type MessageHandler = (message: string, options?: NotifyOptions) => number;

const createHandler = (type: StatusType): MessageHandler => (
  message,
  options
) =>
  setNotification({
    id: genId(),
    createdAt: Date.now(),
    visible: true,
    timeout: defaultTimeouts.get(type) || 3000,
    message,
    type,
    ...options,
  });

export const notify = {
  success: createHandler(StatusType.Success),
  error: createHandler(StatusType.Error),
  loading: createHandler(StatusType.Loading),
  custom: createHandler(StatusType.Custom),
};

export const setNotification = (status: InternalStatus) => {
  memoryQueue = addReducer(memoryQueue, status);
  listeners.forEach((listener) => {
    listener(status);
  });
  return status.id;
};

export const notifyPromise = <T extends any>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: string | ((result: T) => string);
    error: string | ((reason: any) => string);
  }
) => {
  const id = notify.loading(loading);

  promise
    .then((p) => {
      notify.success(typeof success === 'function' ? success(p) : success, {
        id,
      });
      return p;
    })
    .catch((e) => {
      notify.error(typeof error === 'function' ? error(e) : error, {
        id,
      });
    });

  return promise;
};

export const useToasts = () => {
  const [queue, setQueue] = useState<InternalStatus[]>(memoryQueue);
  const [pauseAt, setPausedAt] = useState<number | false>(false);

  useEffect(() => {
    const handler = (status: InternalStatus) => {
      setQueue(addReducer(queue, status));
    };
    listeners.push(handler);
    return () => {
      const index = listeners.indexOf(handler);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [queue]);

  useEffect(() => {
    if (pauseAt) {
      return;
    }

    const now = Date.now();
    const timeouts = queue.map((s) => {
      const duration = s.timeout - (now - s.createdAt);
      if (duration < 0) {
        if (s.visible) {
          setQueue(hideReducer(queue, s));
        }
        return;
      }
      return setTimeout(() => {
        setQueue(hideReducer(queue, s));
      }, duration);
    });

    return () => {
      timeouts.forEach((timeout) => timeout && clearTimeout(timeout));
    };
  }, [queue, pauseAt]);

  const handlers = useMemo(
    () => ({
      onMouseEnter: () => {
        setPausedAt(Date.now());
      },
      onMouseLeave: () => {
        if (pauseAt) {
          const diff = Date.now() - pauseAt;
          setQueue(addPauseReducer(queue, diff));
          setPausedAt(false);
        }
      },
    }),
    [queue, pauseAt]
  );

  return [queue, handlers] as const;
};
