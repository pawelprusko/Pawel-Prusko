import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ categoryTitle }: { categoryTitle?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > (categoryTitle ? 120 : 30));
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categoryTitle]);

  const showDynamicTitle = scrolled && categoryTitle;

  return (
    <header 
      className={`sticky top-0 z-40 transition-colors duration-300 w-full pt-[max(env(safe-area-inset-top),_0px)] ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-md border-b border-white/5' 
          : 'bg-background border-b border-transparent'
      }`}
    >
      <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between w-full">
        <Link to="/" className="grid items-center group">
          <div className={`col-start-1 row-start-1 flex items-center gap-2 font-heading font-bold text-lg tracking-tight text-text-main/90 transition-all duration-500 ${showDynamicTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <span className="text-2xl font-bold leading-none group-hover:-translate-x-1 transition-transform mt-[-3px]">←</span>
            <span>{categoryTitle}</span>
          </div>
          <div className={`col-start-1 row-start-1 font-heading font-bold text-xl md:text-2xl tracking-tight text-text-main/90 transition-all duration-500 ${showDynamicTitle ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            Paweł Prusko
          </div>
        </Link>
      </div>
    </header>
  );
}
