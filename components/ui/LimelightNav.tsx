
import React, { useState, useRef, useLayoutEffect, cloneElement } from 'react';

// --- Internal Types and Defaults ---

export type NavItem = {
  id: string | number;
  icon: React.ReactElement<{ className?: string }>;
  label?: string;
  onClick?: () => void;
};

type LimelightNavProps = {
  items: NavItem[];
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

export const LimelightNav = ({
  items = [],
  defaultActiveIndex = 0,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}: LimelightNavProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    
    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null; 
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };
  
  const activeLabel = items[activeIndex]?.label;

  return (
    <div className="relative flex flex-col items-center">
      <nav className={`relative inline-flex items-center h-16 rounded-full bg-neutral-900/60 border border-gold-500/10 px-2 ${className}`}>
        {items.map(({ id, icon, label, onClick }, index) => (
            <button
              key={id}
              ref={el => { navItemRefs.current[index] = el; }}
              className={`relative z-20 flex h-full cursor-pointer items-center justify-center p-5 transition-all duration-300 ${iconContainerClassName}`}
              onClick={() => handleItemClick(index, onClick)}
              aria-label={label}
              type="button"
            >
              {cloneElement(icon, {
                className: `w-6 h-6 transition-all duration-500 ${
                  activeIndex === index ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(230,183,30,0.5)]' : 'opacity-30 text-white'
                } ${icon.props.className || ''} ${iconClassName || ''}`,
              })}
            </button>
        ))}

        <div 
          ref={limelightRef}
          className={`absolute top-0 z-10 w-10 h-[2px] rounded-full bg-gold-500 ${
            isReady ? 'transition-[left] duration-500 cubic-bezier(0.16, 1, 0.3, 1)' : ''
          } ${limelightClassName}`}
          style={{ left: '-999px' }}
        >
          <div className="absolute left-[-50%] top-0 w-[200%] h-14 bg-gold-500/10 blur-xl pointer-events-none" />
        </div>
      </nav>
      <div className="mt-4 h-6 flex items-center justify-center">
        {activeLabel && (
          <p key={activeLabel} className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-400 animate-fade-in-up">
            {activeLabel}
          </p>
        )}
      </div>
    </div>
  );
};
