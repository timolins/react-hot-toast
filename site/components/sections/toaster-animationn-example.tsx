import clsx from 'clsx';
import toast, { ToastAnimation } from 'react-hot-toast';

import { Code } from '../code';


export const animations: Array<ToastAnimation> = [
  "slide-up",
  "slide-down",
  "slide-right",
  "slide-left",
];

export const ToasterAnimationExample: React.FC<{  
  animation: ToastAnimation;
  onAnimation: (animation: ToastAnimation) => void;
}> = ({  animation, onAnimation }) => {
  const renderAnimation = (a: ToastAnimation) => (
    <button
      id="animation"
      className={clsx(
        'rounded-xl text-center text-xs md:text-sm py-2 px- flex items-center justify-center cursor-pointer flex-col md:flex-row',
        animation === a
        ? 'bg-toast-900 text-toast-100 '
        : 'bg-white shadow-small-button'        
      )}
      key={a}
      onClick={() => {
        toast.success(
          <span>
            Animation set to <b>{a}</b>
          </span>,
          {
            id: 'animation',
            animation:a
          }
        );

        onAnimation(a);
      }}
    >
      <span className="mr-2">{a}</span>
    </button>
  );

  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="flex items-center">
        <div className="w-full grid grid-cols-2 gap-2 bg-toast-100  rounded-xl p-4">
          {animations.map((a) => renderAnimation(a))}
        </div>     
      </div>
      <Code
        snippet={`<Toaster 
  animation="${animation}" 
/>`}
      />
    </section>
  );
};
