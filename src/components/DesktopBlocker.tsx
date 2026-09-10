import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function DesktopBlocker() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <AnimatePresence>
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2C2C] p-8 text-center"
        >
          <div className="max-w-2xl border border-[#816CFF]/20 p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#816CFF]/40" />
            <h1 className="font-heading text-3xl md:text-5xl text-[#816CFF] tracking-wide leading-snug">
              UX OPTIMIZED FOR MOBILE.
            </h1>
            <p className="mt-8 text-lg font-sans uppercase tracking-widest text-[#EFC88B]">
              Please open on a handheld device for full immersion.
            </p>
            <div className="mt-12 flex justify-center space-x-2">
              <div className="w-1 h-1 bg-[#BDFFEA] rounded-full" />
              <div className="w-1 h-1 bg-[#BDFFEA] rounded-full" />
              <div className="w-1 h-1 bg-[#BDFFEA] rounded-full" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
