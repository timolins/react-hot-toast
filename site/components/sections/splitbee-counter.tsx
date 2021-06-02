import React from 'react';
import clsx from 'clsx';

export const useSplitbeeCount = <T extends string>(
  event: T,
  token: string
): number => {
  const [data, setData] = React.useState<number>(0);
  const socket = React.useRef(null);
  React.useEffect(() => {
    if (typeof window !== undefined) {
      socket.current = new WebSocket('wss://realtime.react-hot-toast.com/');
      socket.current.onopen = (e) => {
        socket.current.send(
          JSON.stringify({
            type: 'subscribe',
            data: {
              token: token,
              events: [event],
            },
          })
        );
      };
      socket.current.onmessage = (e) => {
        const d = JSON.parse(e.data);
        setData(d.count);
      };

      return () => {};
    }
  }, []);

  return data;
};

export const SplitbeeCounter = () => {
  const count = useSplitbeeCount('Trigger Toast', 'NTV7AYBLEXW3');

  const letters = count.toString().split('');

  return (
    <div className="flex items-center justify-center p-4 flex-col gap-3 mt-4">
      <div className="font-semibold text-toast-900 rounded text-lg">
        Toasts made on this website so far
      </div>
      <div
        className={clsx('grid gap-2 grid-flow-col', count === 0 && 'opacity-0')}
      >
        {letters.map((l, i) => (
          <div
            className={clsx(
              'animate-enter',
              'bg-toast-100 rounded p-4 text-lg font-bold font-mono'
            )}
            key={i + '-' + l}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="text-toast-600">
        ⚡️ Real-time analytics by{' '}
        <a
          className="underline"
          data-splitbee-event="Click Splitbee Analytics"
          data-splitbee-event-location="Counter"
          href="https://splitbee.io/?ref=rht-realtime"
        >
          Splitbee
        </a>
      </div>
    </div>
  );
};
