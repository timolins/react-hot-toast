import { useEffect, useMemo, useState } from 'react';
import { defaultTimeouts, InternalStatus, Status, StatusType } from '../status';
import { genId } from './utils';

const TOAST_LIMIT = 20;

const addReducer = (queue: InternalStatus[], status: InternalStatus) => {
  if (queue.find((s) => s.id === status.id)) {
    return queue.map((s) => (s.id === status.id ? status : s));
  } else {
    return [...queue, status].slice(
      Math.max(queue.length - (TOAST_LIMIT - 1), 0)
    );
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
  addNotification({
    message,
    type,
    ...options,
  });

export const notify: {
  [key: string]: MessageHandler;
} = {
  success: createHandler(StatusType.Success),
  error: createHandler(StatusType.Error),
  loading: createHandler(StatusType.Loading),
  custom: createHandler(StatusType.Custom),
};

const addNotification = (status: Status) => {
  const newStatus: InternalStatus = {
    id: genId(),
    createdAt: Date.now(),
    visible: true,
    timeout: defaultTimeouts.get(status.type) || 3000,
    ...status,
  };
  memoryQueue = addReducer(memoryQueue, newStatus);
  listeners.forEach((listener) => {
    listener(newStatus);
  });
  return newStatus.id;
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
    const timeouts = queue
      .map((s) => {
        const duration = s.timeout - (now - s.createdAt);

        if (duration < 0) {
          return;
        }
        return setTimeout(() => {
          setQueue(hideReducer(queue, s));
        }, duration);
      })
      .filter((t): t is NodeJS.Timeout => t !== undefined);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [queue, pauseAt]);

  const handlers = useMemo(
    () => ({
      onMouseEnter: () => {
        console.log('Start pause');
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
