import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (hash) {
      const scrollTarget = () => {
        const element =
          document.querySelector(hash) ||
          (hash === '#direct-access' ? document.querySelector('#contact') : null);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      if (!scrollTarget()) {
        const timer1 = setTimeout(scrollTarget, 100);
        const timer2 = setTimeout(scrollTarget, 300);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}
