import Head from 'next/head';
import Logo from '../assets/logo.svg';
import Butter1 from '../assets/butter-1.svg';
import Butter2 from '../assets/butter-2.svg';
import GitHub from '../assets/github.svg';
import Checkmark from '../assets/checkmark.svg';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { ToastExample } from '../components/sections/toast-example';
import { ToasterExample } from '../components/sections/toaster-example';
import * as Prism from 'prismjs';

const Button: React.FC<{ onClick: () => void }> = ({ onClick, children }) => (
  <button
    className="rounded-lg font-bold bg-gradient-to-b from-toast-200 to-toast-300 py-4 px-6 focus:3 shadow-button"
    onClick={onClick}
  >
    {children}
  </button>
);

const Feature: React.FC = ({ children }) => (
  <div className="flex gap-1 items-center">
    <Checkmark />
    <span className="font-bold">{children}</span>
  </div>
);

const Step: React.FC<{
  count: number;
  title: string;
  subTitle: string;
  code: JSX.Element;
}> = (props) => (
  <div className="flex flex-col gap-1 items-center">
    <div className="h-6 w-6 text-sm rounded-full bg-toast-900 text-toast-50 flex items-center justify-center">
      {props.count}
    </div>
    <div className="font-bold">{props.title}</div>
    <div className="text-red-700 text-sm">{props.subTitle}</div>
    <code className="mt-2 border border-red-100 py-2 px-4 rounded font-bold bg-white w-full">
      {props.code}
    </code>
  </div>
);

const Steps = () => (
  <div className="grid  grid-cols-1 md:grid-cols-3 gap-4 my-12">
    <Step
      count={1}
      title="Install package"
      subTitle="It weighs less than 5kb"
      code={
        <code>
          <span className="text-toast-600">yarn add</span>{' '}
          <span className="text-toast-800">react-hot-toast</span>
        </code>
      }
    ></Step>
    <Step
      count={2}
      title="Add Toaster to your app"
      subTitle="Make sure it's placed at the top"
      code={
        <>
          <span className="text-toast-600">{'<div>'}</span>
          <span className="text-toast-800">{'<Toaster/>'}</span>
          <span className="text-toast-600">{'<div>'}</span>
        </>
      }
    ></Step>
    <Step
      count={3}
      title="Start toasting!"
      subTitle="Call it from anywhere"
      code={
        <>
          <span className="text-toast-600">{'toast'}</span>
          <span className="text-toast-800">{'("Hello World")'}</span>
        </>
      }
    ></Step>
  </div>
);

const Features = () => (
  <div className="my-12 grid gap-x-2 gap-y-5 grid-cols-2 md:grid-cols-3">
    <Feature>Hot by default</Feature>
    <Feature>Easy to use</Feature>
    <Feature>Accessible</Feature>
    <Feature>Emoji Support</Feature>
    <Feature>Customizable</Feature>
    <Feature>Promise API</Feature>
    <Feature>Lightweight</Feature>
    <Feature>Pause on hover</Feature>
    <Feature>Headless Hooks</Feature>
  </div>
);

export default function Home() {
  const [position, setPosition] = useState<any>('top-center');
  const [reverse, setReverse] = useState(false);
  const { toasts: allToasts } = useToasterStore();

  const shouldFade =
    allToasts.filter((t) => t.visible).length && position.includes('top');
  return (
    <div>
      <Head>
        <title>react-hot-toast - The best React notifications in town</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-gradient-to-b from-toast-50 to-white bg-opacity-10">
        <div className="container  flex flex-col items-center relative">
          <Butter1
            className="absolute -left-24 md:left-24 transition-all duration-200"
            onClick={() => {
              // toast(
              //   <span>
              //     Pssst! Get -20% off Splitbee Pro:{' '}
              //     <a href="https://splitbee.io/?butter">
              //       <code>
              //         <b>REACT-HOT-TOST</b>
              //       </code>
              //     </a>
              //   </span>,
              //   {
              //     icon: <span className="text-3xl">🤫 🐝</span>,
              //     duration: 1000,
              //   }
              // );
            }}
            style={{
              opacity: shouldFade ? 0.5 : 1,
              // filter: `blur(${shouldFade ? 5 : 0}px)`,
            }}
          />
          <Butter2 className="absolute right-24 bottom-4 " />

          <Logo
            role="img"
            // alt="react-hot-toast"
            className="relative animate-slide-in transition-all duration-200 -mt-8 md:-mt-4"
            style={{
              opacity: shouldFade ? 0.2 : 1,
              filter: `blur(${shouldFade ? 6 : 0}px)`,
              // transform: toasts.length
              //   ? 'translateY(-100%)'
              //   : 'translateY(0)',
            }}
          />
          <div
            className="text-center my-12 relative transition-all duration-200"
            style={
              {
                // transform: toasts.length ? 'translateY(-30px)' : 'translateY(0)',
              }
            }
          >
            <h1 className="text-4xl animate-enter font-bold text-toast-900">
              The best toast in town.
            </h1>
            <h2 className="text-2xl font-bold text-toast-600 mt-2">
              Smoking hot React notifications.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 rounded-2xl bg-toast-200 p-4 w-full max-w-lg">
            <button
              className={clsx(
                'rounded-lg font-bold gap-4 flex bg-gradient-to-b from-white to-toast-200 shadow-button text-center',
                'py-4 px-6',
                'active:translate-y-0.5 active:from-toast-100 active:shadow-none active:to-toast-100 active:bg-gray-100  transform '
              )}
              onClick={() => {
                const promise = new Promise((res, rej) => {
                  if (Math.random() < 0.85) {
                    setTimeout(res, 1000);
                  } else {
                    setTimeout(rej, 3000);
                  }
                });

                const opts = {
                  style: {
                    width: '200px',
                    paddingRight: '10px',
                  },
                };

                toast.promise(
                  promise,
                  {
                    loading: 'Preparing toast',
                    error: 'Whoops, it burnt',
                    success: "Here's your toast",
                  },
                  {
                    error: opts,
                    loading: opts,
                    success: opts,
                  }
                );
              }}
            >
              <div>🛎 </div>
              <span className="flex-1 mr-2">Make me a toast</span>
            </button>
            <button
              className="rounded-lg flex font-bold bg-white py-4 px-6 shadow-button  text-toast-800"
              onClick={() => {}}
            >
              <GitHub className="opacity-100" />
              <span className="flex-1 text-toast-800">GitHub</span>
            </button>
          </div>

          <div className="m-4 gap-2">
            <a href="https://github.com/timolins/react-hot-toast">GitHub</a>
            <a href="https://twitter.com/timolins">Twitter</a>
          </div>

          <Features />
          <Steps />
          <div className="w-full max-w-4xl">
            <div className="my-14">
              <h2 className="ml-5 text-2xl font-bold">Examples</h2>
              <ToastExample />
            </div>
            <div className="my-14">
              <h2 className="mr-5 mb-4 text-right text-2xl font-bold">
                Change Position
              </h2>

              <ToasterExample
                onReverse={setReverse}
                reverse={reverse}
                position={position}
                onPosition={setPosition}
              />
            </div>
          </div>
        </div>
      </header>

      <Toaster
        position={position}
        reverseOrder={reverse}
        // options={{
        //   all: {
        //     style: {
        //       minHeight: '200px',
        //     },
        //     duration: 2000,
        //   },

        //   // icon: 'JOhannes',
        //   // style: {
        //   //   // background: 'green',
        //   //   minWidth: '300px',
        //   // },
        //   // className: 'green',
        // }}
        // toastStyle={(t) => ({
        //   background: t.type === 'success' ? 'green' : 'red',
        // })}
      />
      <footer className="container">test</footer>
    </div>
  );
}
