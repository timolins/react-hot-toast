<a href="https://react-hot-toast.com/"><img alt="react-hot-toast - Try it out" src="https://github.com/timolins/react-hot-toast/raw/main/assets/header.svg"/></a>

<div align="center">
    <img src="https://badgen.net/npm/v/react-hot-toast" alt="NPM Version" />
  <img src="https://badgen.net/bundlephobia/minzip/react-hot-toast" alt="minzipped size"/>
    <img src="https://github.com/timolins/react-hot-toast/workflows/CI/badge.svg" alt="Build Status" />
</a>
</div>
<br />
<div align="center"><strong>Smoking hot  Notifications for React.</strong></div>
<div align="center"> Lightweight, customizable and beautiful by default.</div>
<br />
<div align="center">
<a href="https://react-hot-toast.com/">Website</a> 
<span> · </span>
<a href="https://react-hot-toast.com/docs">Documentation</a> 
<span> · </span>
<a href="https://twitter.com/timolins">Twitter</a>
</div>

<br />

## Features

- 🔥 **Hot by default**
- 🔩 **Easily Customizable**
- ⏳ **Promise API** - _Automatic loader from a promise_
- 🕊 **Lightweight** - _less than 5kb including styles_
- ✅ **Accessible**
- 🤯 **Headless Hooks** - _Create your own with [`useToaster()`](https://react-hot-toast.com/docs/use-toaster)_

## Getting started

#### Install with yarn

```sh
yarn add react-hot-toast
```

#### Install with NPM

```sh
npm install react-hot-toast
```

---

### Add to `<Toaster/>` your app

The Toaster will take care of rendering all notifications emitted. Make sure to place it somewhere high up in your app.

```jsx
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div>
      <Toaster />
    </div>
  );
};
```

---

### Create toasts from anywhere

Call `toast()` anywhere within your app to emit new notifications.

```js
import toast from 'react-hot-toast';

toast.success('Hello World!');
```

---

## Full Documentation

Find the full API reference on [official documentation](https://react-hot-toast.com/docs).

## Credits

**react-hot-toast** was cooked by [Timo Lins](https://timo.sh) 👨‍🍳
