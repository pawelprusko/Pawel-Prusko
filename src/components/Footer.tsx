import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-text-darker/30 pt-10 pb-[max(env(safe-area-inset-bottom),_3rem)] px-6 relative">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <div className="flex justify-between items-center w-full gap-4">
          <div className="font-heading font-medium text-text-main/60">Paweł Prusko © {new Date().getFullYear()}</div>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/pawelprusko?igsh=MTMxMnRtbWJ3emRkcg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-text-muted hover:text-text-main transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
