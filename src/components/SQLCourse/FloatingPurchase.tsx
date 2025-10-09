import { ArrowRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/classname';
import { BuyButton } from './BuyButton';

export function FloatingPurchase() {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    function onScroll() {
      setIsHidden(window.scrollY < 400);
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-5 flex items-center justify-center transition-all duration-200 ease-out',
        {
          'pointer-events-none -bottom-10 opacity-0': isHidden,
        },
      )}
    >
      {/* Desktop version */}
      <div className="hidden mb-5 md:flex w-full max-w-[800px] items-center justify-between rounded-2xl bg-yellow-950 p-5 shadow-lg ring-1 ring-yellow-500/40">
        <div className="flex flex-col">
          <h2 className="mb-1 text-xl font-medium text-white">
            Go from Zero to Hero in SQL
          </h2>
          <p className="text-sm text-zinc-400">
            Get instant access to the course and start learning today
          </p>
        </div>

        <BuyButton variant="floating" />
      </div>

      {/* Mobile version */}
      <div className="flex md:hidden w-full flex-col bg-yellow-950 px-4 pt-3 pb-4 shadow-lg ring-1 ring-yellow-500/40">
        <div className="flex flex-col items-center text-center mb-3">
          <h2 className="text-lg font-medium text-white">
            Master SQL Today
          </h2>
          <p className="text-xs text-zinc-400">
            Get instant lifetime access
          </p>
        </div>

        <BuyButton variant="floating" />
      </div>
    </div>
  );
}
