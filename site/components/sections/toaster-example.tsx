import clsx from 'clsx';
import toast from 'react-hot-toast';
import Arrow from '../../assets/arrow.svg';
import { Code } from '../code';

import { EmojiButton } from '../emoji-button';

export const positions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

export const ToasterExample: React.FC<{
  position: string;
  onPosition: (pos: string) => void;
  reverse: boolean;
  onReverse: (rev: boolean) => void;
}> = ({ position, onPosition, reverse, onReverse }) => {
  const reverseIt = () => {
    setTimeout(() => {
      toast('Notification 1', {
        icon: '1️⃣',
        id: 'reverse-1',
      });
    }, 10);

    setTimeout(
      () =>
        toast('Notification 2', {
          icon: '2️⃣',
          id: 'reverse-2',
        }),
      250
    );
    setTimeout(
      () =>
        toast('Notification 3', {
          icon: '3️⃣',
          id: 'reverse-3',
        }),
      500
    );
    setTimeout(
      () =>
        toast('Notification 4', {
          icon: '4️⃣',
          id: 'reverse-4',
        }),
      750
    );
    (window as any).splitbee?.track('Change Order', {
      reverseOrder: !reverse,
    });
    onReverse(!reverse);
  };

  const renderPosition = (p: string) => (
    <button
      id="p"
      className={clsx(
        'rounded-xl text-center text-xs md:text-sm py-2 px- flex items-center justify-center cursor-pointer flex-col md:flex-row',
        position === p
          ? 'bg-toast-900 text-toast-100 '
          : 'bg-white shadow-small-button'
      )}
      key={p}
      data-splitbee-event="Change Position"
      data-splitbee-event-position={p}
      onClick={() => {
        toast.dismiss('position');
        toast.success(
          <span>
            Position set to <b>{p}</b>
          </span>,
          {
            id: 'position',
          }
        );

        (window as any).splitbee?.track('Change Position', {
          position: p,
        });

        onPosition(p);
      }}
    >
      <span className="mr-2">{p}</span>
    </button>
  );

  return (
    <section className="grid md:grid-cols-3 gap-2">
      {/* <Highlight
        {...defaultProps}
        language="jsx"
        code={}
      /> */}
      <Code
        snippet={`<Toaster
  position="${position}"
  reverseOrder={${reverse}}
/>`}
      />

      <div className="order-first col-span-2 md:order-1">
        <div className="grid grid-cols-3 justify-between bg-toast-100 rounded-xl gap-x-2 gap-y-4 p-2 md:p-4">
          {positions.map((p) => renderPosition(p))}
        </div>
        <div className="flex justify-center my-4">
          <EmojiButton
            emoji={
              <Arrow
                className={clsx(
                  'transform transition-transform',
                  ((position.includes('bottom') && !reverse) ||
                    (position.includes('top') && reverse)) &&
                    'rotate-180'
                )}
              />
            }
            onClick={reverseIt}
          >
            Toggle Direction
          </EmojiButton>
        </div>
      </div>
    </section>
  );
};
