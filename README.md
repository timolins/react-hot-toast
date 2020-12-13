# react-hot-toast

> Not yet published - improved docs coming soon

## Install

```sh
yarn add react-hot-toast
```

or with npm

```sh
npm install react-hot-toast
```

## Basic usage

```jsx
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div>
      <Toaster />
    </div>
  );
};

// Show notifications anywhere
toast('Hello World');
```

Toasts are removed automatically after their duration. Hovering on one toast will pause all them.

## `<Toaster />` API

```jsx
<Toaster
  position="top-center" // Support top-left, top-center, top-right, bottom-left, bottom-center & bottom-right
  reverseOrder={false} // Toasts spawn at top by default. Set to `true` if you want new Toasts at the end
  // Custom styling
  toastStyle={{
    margin: '40px',
    background: '#363636',
    color: '#fff',
    zIndex: 1,
  }}
  toastClassName=""
  iconTheme={{
    success: {
      primary: 'green',
      secondary: 'black',
    },
  }}
/>
```

## `toast()` API

### Create a toast

```js
toast('Hello World'); // Blank (No icon)
toast.success('Successfully created!'); // Checkmark
toast.error('This is an error!'); // Error
toast.loading('Waiting...'); // Loading spinner

// Emoji (animated)
toast('Awesome!', {
  icon: '🎉',
});
```

### Available `toast()` options

```js
toast('Hello World', {
  duration: 4000,
  icon: '👏',

  // Aria
  role: 'status',
  ariaLive: 'polite',
});
```

### Remove a toast programmatically

Toasts will auto-remove bei default.

```js
const toastId = toast.loading('Loading...');

// ...

toast.dismiss(toastId);
```

### Update an existing toast

```js
const toastId = toast.loading('Loading...');

// ...

toast.success('This worked', {
  id: toastId,
});
```

### Use with promises

This shorthand is useful for mapping a promise to a toast. It will update when the promise resolves or fails.

#### Simple Usage

```js
toast.promise(myPromise, {
  loading: 'Loading',
  success: 'Got the data',
  error: 'Error when fetching',
});
```

#### Advanced

```js
toast.promise(
  myPromise,
  // Messages for each outcome. Support callback to include Promise result
  {
    loading: 'Loading',
    success: (data) => `Successfully saved ${data.name}`,
    error: (err) => `This just happened: ${err.toString()}`,
  },
  // Options for each outcome
  {
    success: {
      duration: 5000,
      icon: '🔥',
    },
  }
);
```

### Render custom content

You can provide a React components instead of text.

```jsx
// Basic usage
toast(
  <span>
    Custom and <b>bold</b>
  </span>,
  {
    icon: <Icon />,
  }
);
```

## `useToaster()` API

Create your own notifications with **headless mode**. Tree shaking is supported, so you won't ship any unused styles.

```jsx
const Notifications = () => {
  const { visibleToasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div onMouseEnter={startPause} onMouseLeave={endPause}>
      {visibleToasts.map((toast) => (
        <div key={toast.id} role={toast.role} aria-live={toast.ariaLive}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

// Create toasts anywhere
toast('Hello World');
```

### Animated Example

Instead of mapping over `visibleToasts` we'll use `toasts`. We animate them based on `toast.visible`. Toasts will be removed from `toasts` 1 second after being dismissed.

```jsx
const Notifications = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;

  return (
    <div
      style={{
        position: 'fixed',
        top: 8,
        left: 8,
      }}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast) => {
        const offset = calculateOffset(toast.id, {
          reverseOrder: false,
          margin: 8,
        });

        const ref = (el) => {
          if (el && !toast.height) {
            const height = el.getBoundingClientRect().height;
            updateHeight(toast.id, height);
          }
        };
        return (
          <div
            key={toast.id}
            ref={ref}
            style={{
              position: 'absolute',
              width: '200px',
              background: 'papayawhip',
              transition: 'all 0.5s ease-out',
              opacity: toast.visible ? 1 : 0,
              transform: `translateY(${offset}px)`,
            }}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
};
```
