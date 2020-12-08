import { useEffect, useMemo, useState } from 'react';
import { defaultTimeouts, InternalStatus, Status, StatusType } from '../status';
import { genId } from './utils';

let memoryQueue: InternalStatus[] = [];

const addReducer = (queue: InternalStatus[], status: InternalStatus) => {
  if (queue.find((s) => s.id === status.id)) {
    return queue.map((s) => (s.id === status.id ? status : s));
  } else {
    return [...queue, status];
  }
};

const removeReducer = (queue: InternalStatus[], status: InternalStatus) => {
  return queue.filter(
    (s) => !(s.id === status.id && s.createdAt === status.createdAt)
  );
};

const addPauseReducer = (queue: InternalStatus[], pause: number) => {
  return queue.map((s) => ({
    ...s,
    timeout: s.timeout + pause,
  }));
};

const listeners: Array<(status: InternalStatus) => void> = [];

export const notify = (status: Status) => {
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
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  const id = notify({
    type: StatusType.Loading,
    message: messages.loading,
  });

  promise
    .then((p) => {
      notify({
        id: id,
        type: StatusType.Success,
        message: messages.success,
      });
      return p;
    })
    .catch(() => {
      notify({
        id: id,
        type: StatusType.Error,
        message: messages.error,
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
      return setTimeout(() => {
        setQueue(removeReducer(queue, s));
      }, s.timeout - (now - s.createdAt));
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [queue]);

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
