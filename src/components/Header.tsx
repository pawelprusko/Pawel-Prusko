import { useState, useEffect, MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface HeaderProps {
  categoryTitle?: string;
  headerLink?: string;
  showArticles?: boolean;
}

// Unified CSS styling for all header action states ("Menu +", "Close ✕", "Inquire →")
// Using the exact elegant Serif font (font-heading / Playfair Display) as "Inquire" on desktop and logo "Paweł Prusko"
const UNIFIED_HEADER_ACTION_CLASS =
  'inline-flex items-center gap-1.5 font-heading text-base md:text-[17px] tracking-tight font-normal text-text-main/80 hover:text-secondary transition-colors duration-200 cursor-pointer select-none leading-none py-1 bg-transparent border-0 outline-none whitespace-nowrap';

export default function Header({}: HeaderProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/' || location.pathname === '';

  // Track scroll position for transparent vs blurred background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen && isHomePage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isHomePage]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Navigate to Home / top of page
  const handleGoHome = (e?: MouseEvent) => {
    if (e) e.preventDefault();
    setIsMenuOpen(false);
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.pushState(null, '', '/');
      }
    } else {
      navigate('/');
    }
  };

  // Smart Anchor Navigation for Home Page
  const handleScrollToAnchor = (targetAnchor: string, e?: MouseEvent) => {
    if (e) e.preventDefault();
    setIsMenuOpen(false);
    const cleanId = targetAnchor.replace(/^#/, '');

    if (isHomePage) {
      const el =
        document.getElementById(cleanId) ||
        (cleanId === 'direct-access' ? document.getElementById('contact') : null);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${cleanId}`);
      }
    } else {
      navigate(`/#${cleanId}`);
    }
  };

  // Direct scroll to #contact on the current subpage
  const handleScrollToContact = (e?: MouseEvent) => {
    if (e) e.preventDefault();
    setIsMenuOpen(false);
    const contactEl =
      document.getElementById('contact') ||
      document.getElementById('direct-access');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#contact');
    } else {
      navigate('/#contact');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 w-full pt-[max(env(safe-area-inset-top),_0px)] ${
          scrolled && !isMenuOpen
            ? 'bg-background/95 backdrop-blur-md'
            : 'bg-background'
        }`}
      >
        <div className="max-w-3xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between w-full box-border">
          {/* Lewa strona: Logo Paweł Prusko (zlinkowane do strony głównej /, zawsze stabilne) */}
          <a
            href="/"
            onClick={handleGoHome}
            className="font-heading font-bold text-xl md:text-2xl tracking-tight text-text-main/90 hover:text-text-main transition-colors cursor-pointer select-none leading-none inline-flex items-center"
          >
            Paweł Prusko
          </a>

          {/* Prawa strona */}
          {isHomePage ? (
            /* WARIANT A: STRONA GŁÓWNA */
            <div className="flex items-center">
              {/* DESKTOP (screens >= 1024px): nawigacja horyzontalna w font-heading */}
              <nav className="hidden lg:flex items-center gap-8">
                <a
                  href="/#bespoke-production"
                  onClick={(e) => handleScrollToAnchor('bespoke-production', e)}
                  className="font-heading text-base md:text-[17px] tracking-tight text-text-main/80 hover:text-secondary transition-colors duration-200 cursor-pointer whitespace-nowrap leading-none py-1"
                >
                  Bespoke Production
                </a>

                <a
                  href="/#instant-studio"
                  onClick={(e) => handleScrollToAnchor('instant-studio', e)}
                  className="font-heading text-base md:text-[17px] tracking-tight text-text-main/80 hover:text-secondary transition-colors duration-200 cursor-pointer whitespace-nowrap leading-none py-1"
                >
                  Instant Studio
                </a>

                <a
                  href="/#articles"
                  onClick={(e) => handleScrollToAnchor('articles', e)}
                  className="font-heading text-base md:text-[17px] tracking-tight text-text-main/80 hover:text-secondary transition-colors duration-200 cursor-pointer whitespace-nowrap leading-none py-1"
                >
                  Articles
                </a>
              </nav>

              {/* MOBILE (screens < 1024px): Przełącznik "Menu +" / "Close ✕" ze szeryfowym font-heading */}
              <div className="lg:hidden flex items-center">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={UNIFIED_HEADER_ACTION_CLASS}
                  aria-label={isMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                >
                  <span className="font-heading text-base md:text-[17px] tracking-tight leading-none">
                    {isMenuOpen ? 'Close' : 'Menu'}
                  </span>
                  <span className="font-heading text-base md:text-[17px] leading-none" aria-hidden="true">
                    {isMenuOpen ? '✕' : '+'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* WARIANT B: WSZYSTKIE PODSTRONY (Desktop + Mobile) - w pełni ujednolicony szeryfowy krój pisma */
            <div className="flex items-center">
              <a
                href="#contact"
                onClick={handleScrollToContact}
                className={UNIFIED_HEADER_ACTION_CLASS}
                aria-label="Direct Access and Inquiries"
              >
                <span className="font-heading text-base md:text-[17px] tracking-tight leading-none">
                  Inquire
                </span>
                <span className="font-heading text-base md:text-[17px] leading-none" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          )}
        </div>
      </header>

      {/* FULL-SCREEN OVERLAY DLA MOBILE (wyłącznie na stronie głównej, screens < 1024px) */}
      {isHomePage && (
        <div
          className={`fixed inset-0 z-40 bg-[#F9F2EA] flex flex-col justify-between px-6 pb-8 pt-[calc(max(env(safe-area-inset-top),0px)+4.5rem)] transition-all duration-300 ease-in-out lg:hidden ${
            isMenuOpen
              ? 'opacity-100 pointer-events-auto translate-y-0'
              : 'opacity-0 pointer-events-none -translate-y-2'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Nawigacja w stylu magazynowym (duża typografia serif, wiersz pod wierszem z numeracją 01, 02, 03...) */}
          <nav className="flex flex-col gap-4 sm:gap-5 my-auto w-full max-w-xl mx-auto py-4">
            {/* 01 / HOME */}
            <a
              href="/"
              onClick={handleGoHome}
              className="group flex items-baseline gap-3 sm:gap-4 py-2 border-b border-text-darker/15 hover:border-secondary transition-colors text-left cursor-pointer w-full"
            >
              <span className="font-mono text-xs sm:text-sm tracking-widest text-text-muted/70 group-hover:text-secondary transition-colors flex-shrink-0">
                01 /
              </span>
              <span className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-main group-hover:text-secondary group-hover:translate-x-2 transition-all duration-300 tracking-tight">
                HOME
              </span>
            </a>

            {/* 02 / BESPOKE SCENE PRODUCTION */}
            <a
              href="/#bespoke-production"
              onClick={(e) => handleScrollToAnchor('bespoke-production', e)}
              className="group flex items-baseline gap-3 sm:gap-4 py-2 border-b border-text-darker/15 hover:border-secondary transition-colors text-left cursor-pointer w-full"
            >
              <span className="font-mono text-xs sm:text-sm tracking-widest text-text-muted/70 group-hover:text-secondary transition-colors flex-shrink-0">
                02 /
              </span>
              <span className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-main group-hover:text-secondary group-hover:translate-x-2 transition-all duration-300 tracking-tight">
                BESPOKE SCENE PRODUCTION
              </span>
            </a>

            {/* 03 / INSTANT CULINARY STUDIO */}
            <a
              href="/#instant-studio"
              onClick={(e) => handleScrollToAnchor('instant-studio', e)}
              className="group flex items-baseline gap-3 sm:gap-4 py-2 border-b border-text-darker/15 hover:border-secondary transition-colors text-left cursor-pointer w-full"
            >
              <span className="font-mono text-xs sm:text-sm tracking-widest text-text-muted/70 group-hover:text-secondary transition-colors flex-shrink-0">
                03 /
              </span>
              <span className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-main group-hover:text-secondary group-hover:translate-x-2 transition-all duration-300 tracking-tight">
                INSTANT CULINARY STUDIO
              </span>
            </a>

            {/* 04 / ARTICLES & PERSPECTIVES */}
            <a
              href="/#articles"
              onClick={(e) => handleScrollToAnchor('articles', e)}
              className="group flex items-baseline gap-3 sm:gap-4 py-2 border-b border-text-darker/15 hover:border-secondary transition-colors text-left cursor-pointer w-full"
            >
              <span className="font-mono text-xs sm:text-sm tracking-widest text-text-muted/70 group-hover:text-secondary transition-colors flex-shrink-0">
                04 /
              </span>
              <span className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-main group-hover:text-secondary group-hover:translate-x-2 transition-all duration-300 tracking-tight">
                ARTICLES & PERSPECTIVES
              </span>
            </a>

            {/* 05 / DIRECT ACCESS */}
            <a
              href="/#direct-access"
              onClick={(e) => handleScrollToAnchor('direct-access', e)}
              className="group flex items-baseline gap-3 sm:gap-4 py-2 border-b border-text-darker/15 hover:border-secondary transition-colors text-left cursor-pointer w-full"
            >
              <span className="font-mono text-xs sm:text-sm tracking-widest text-text-muted/70 group-hover:text-secondary transition-colors flex-shrink-0">
                05 /
              </span>
              <span className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-main group-hover:text-secondary group-hover:translate-x-2 transition-all duration-300 tracking-tight">
                DIRECT ACCESS
              </span>
            </a>
          </nav>

          {/* Dolna stopka w nakładce mobilnej */}
          <div className="w-full max-w-xl mx-auto pt-2 font-mono text-[11px] text-text-muted">
            <span>New-Gen AI Culinary Art Studio</span>
          </div>
        </div>
      )}
    </>
  );
}
