import * as React from 'react';
import { setup } from 'goober';

import { StatusBar } from './components/toast';
import { useToasts, notify, notifyPromise } from './core/use-toasts';
import { StatusType } from './status';

export { StatusBar, notify, notifyPromise };

setup(React.createElement);

export { StatusType };

export const Thing = () => {
  const [toasts, handlers] = useToasts();
  const activeStatus = toasts[toasts.length - 1];

  console.log({ toasts });
  return (
    <div {...handlers}>
      <button
        onClick={() => {
          // setReRender(!reRender);
        }}
      >
        Rerender
      </button>
      Hans the snozzberries ertaste like snozzberries {toasts.length}
      <StatusBar
        visible={!!activeStatus}
        // delay={100}
        status={activeStatus}

        // done={loading}
        // statusType={loading ? StatusType.Loading : StatusType.Success}
      />
    </div>
  );
};
