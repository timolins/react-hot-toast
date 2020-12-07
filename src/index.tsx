import * as React from 'react';
import { useState, useEffect } from 'react';
import { setup } from 'goober';

import { StatusBar } from './components/toast';
import { defaultTimeouts, InternalStatus, Status, StatusType } from './status';

export { StatusBar };

setup(React.createElement);

const genId = (() => {
  let count = 0;
  return () => {
    return ++count;
  };
})();

export { StatusType };

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

export const Thing = () => {
  const [queue, setQueue] = useState<InternalStatus[]>(memoryQueue);
  const [pause, setPausedAt] = useState<
    | {
        start: number;
        end?: number;
      }
    | false
  >(false);

  const [reRender, setReRender] = useState(false);

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
    const now = Date.now();

    if (pause && pause.start && !pause.end) {
      return;
    }

    const timeouts = queue.map((s) => {
      let diff: number = 0;
      if (pause && pause.start && pause.end) {
        diff = pause.end - pause.start;
      }

      return setTimeout(() => {
        setQueue(removeReducer(queue, s));
      }, s.timeout + diff - (now - s.createdAt));
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [queue, pause]);

  const activeStatus = queue[queue.length - 1];

  console.log({ activeStatus, queue });
  return (
    <div
      onMouseEnter={() => {
        setPausedAt({ start: Date.now() });
      }}
      onMouseLeave={() => {
        if (pause) {
          setPausedAt({
            ...pause,
            end: Date.now(),
          });
        }
      }}
    >
      <button
        onClick={() => {
          setReRender(!reRender);
        }}
      >
        Rerender
      </button>
      Hans the snozzberries ertaste like snozzberries {queue.length}
      {!reRender && (
        <StatusBar
          visible={!!activeStatus}
          // delay={100}
          status={activeStatus}

          // done={loading}
          // statusType={loading ? StatusType.Loading : StatusType.Success}
        />
      )}
    </div>
  );
};
