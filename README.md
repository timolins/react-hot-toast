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
<div align="center">
  <sub>Cooked by <a href="https://twitter.com/timolins">Timo Lins</a> 👨‍🍳</sub>
</div>

<br />

## Features

- 🔥 **Hot by default**
- 🔩 **Easily Customizable**
- ⏳ **Promise API** - _Automatic loader from a promise_
- 🕊 **Lightweight** - _less than 5kb including styles_
- ✅ **Accessible**
- 🤯 **Headless Hooks** - _Create your own with [`useToaster()`](https://react-hot-toast.com/docs/use-toaster)_

## Installation

#### With pnpm

```sh
pnpm add react-hot-toast
```

#### With NPM

```sh
npm install react-hot-toast
```

## Getting Started

Add the Toaster to your app first. It will take care of rendering all notifications emitted. Now you can trigger `toast()` from anywhere!

```jsx
import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast('Here is your toast.');

const App = () => {
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />
    </div>
  );
};
```

## Content Security Policy (CSP)

react-hot-toast supports strict Content Security Policies through an opt-in strict CSP mode.

### Default Mode

By default, react-hot-toast uses inline styles for maximum flexibility. This requires `style-src 'unsafe-inline'` in your CSP.

### Strict CSP Mode

For applications with strict CSP that disallow inline styles, enable strict CSP mode:

```jsx
import toast, { Toaster } from 'react-hot-toast';

<Toaster strictCSP={true} />
```

In strict CSP mode:
- All inline `style` props are ignored
- Styling must be done via CSS classes and CSS variables
- Toast positioning uses CSS flexbox instead of inline transforms
- Fully compatible with CSP `style-src 'nonce-...'` directives

The library uses [goober](https://github.com/cristianbote/goober) for styling. To support CSP nonces, set `window.__nonce__` before your app loads:

```html
<script nonce="your-nonce-here">
  window.__nonce__ = 'your-nonce-here';
</script>
```

goober will automatically apply the nonce to its generated `<style>` elements.

Make sure your CSP includes `style-src 'nonce-your-nonce-here'` and `script-src 'nonce-your-nonce-here'`.

## Documentation

Find the full API reference on [official documentation](https://react-hot-toast.com/docs).
