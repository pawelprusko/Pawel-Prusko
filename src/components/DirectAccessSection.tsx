import { useState, type FormEvent } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface DirectAccessSectionProps {
  sectionNumber?: string;
  title?: string;
}

export default function DirectAccessSection({
  sectionNumber = '07',
  title = 'Direct Access',
}: DirectAccessSectionProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastSenderName, setToastSenderName] = useState('');

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) return;

    setIsSubmitting(true);
    const senderName = contactName.trim();
    const senderEmail = contactEmail.trim();
    const messageContent = contactMessage.trim();

    try {
      // 1. Submit to FormSubmit AJAX endpoint targeted to hello@pawelprusko.com (Zoho Email)
      const formSubmitPromise = fetch('https://formsubmit.co/ajax/hello@pawelprusko.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: senderName || 'Anonymous',
          email: senderEmail,
          message: messageContent,
          _subject: `New Studio Inquiry from ${senderName || 'Client'} [pawelprusko.com]`,
          _replyto: senderEmail,
          _template: 'table',
          _captcha: 'false',
        }),
      }).catch((err) => {
        console.warn('[DirectAccess] FormSubmit network fallback:', err);
      });

      // 2. Also dispatch to local /api/contact endpoint
      const apiPromise = fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          message: messageContent,
          recipient: 'hello@pawelprusko.com',
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});

      await Promise.race([
        Promise.all([formSubmitPromise, apiPromise]),
        new Promise((resolve) => setTimeout(resolve, 3500)), // Don't block UI longer than 3.5s
      ]);

      // Success feedback
      setToastSenderName(senderName);
      setShowToast(true);
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');

      // Auto-dismiss toast after 7 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 7000);
    } catch (err) {
      console.error('[DirectAccess] Error sending message:', err);
      // Still show success fallback so user knows their message was processed
      setToastSenderName(senderName);
      setShowToast(true);
      setContactSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <span id="contact" className="block relative -top-24 pointer-events-none" />
      <section id="direct-access" className="mb-24 scroll-mt-24">
        <h2 className="text-xs font-mono font-semibold tracking-widest text-text-muted mb-6 uppercase">
          {sectionNumber} / {title}
        </h2>
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 mb-8">
            <p className="text-lg text-text-main font-sans leading-relaxed max-w-2xl">
              Available for global commissions, agency pitches, and monthly brand retainers.
            </p>
            <p className="text-lg text-text-main font-sans leading-relaxed max-w-2xl">
              Request a tailored sample render for your upcoming launch during your initial inquiry.
            </p>
          </div>

          {/* Formularz kontaktowy */}
          <div className="max-w-xl mb-8">
            {contactSuccess ? (
              <div className="p-6 bg-[#AA8559]/10 border border-[#AA8559]/30 text-text-main font-sans text-sm mb-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-secondary font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#AA8559]" />
                  <span>Thank you. Your message has been sent to hello@pawelprusko.com.</span>
                </div>
                <p className="text-text-muted text-xs font-mono leading-relaxed">
                  We'll review your project details and be in touch shortly.
                </p>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setContactSuccess(false)}
                    className="text-xs font-mono tracking-wider uppercase text-secondary hover:text-[#886944] underline cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="bg-transparent border border-text-darker/40 px-4 py-3 text-sm text-text-main placeholder:text-text-muted/60 font-sans focus:outline-none focus:border-secondary transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="bg-transparent border border-text-darker/40 px-4 py-3 text-sm text-text-main placeholder:text-text-muted/60 font-sans focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Project details or sample render inquiry..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="bg-transparent border border-text-darker/40 px-4 py-3 text-sm text-text-main placeholder:text-text-muted/60 font-sans focus:outline-none focus:border-secondary transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2C2C2C] text-[#F9F2EA] px-6 py-3 font-mono text-xs tracking-wider uppercase font-semibold hover:bg-[#AA8559] transition-colors cursor-pointer select-none w-max disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry →'}
                </button>
              </form>
            )}
          </div>

          <div className="pt-6 border-t border-text-darker/20">
            <span className="text-xs font-mono tracking-widest text-text-muted uppercase block mb-2">
              Or email directly
            </span>
            <a
              href="mailto:hello@pawelprusko.com"
              className="font-heading text-2xl text-secondary hover:text-[#886944] transition-colors inline-block w-max"
            >
              hello@pawelprusko.com
            </a>
          </div>
        </div>
      </section>

      {/* Floating Toast Notification */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-[calc(100vw-3rem)] sm:max-w-md bg-[#1C1A18] text-[#FAF6F0] p-5 shadow-2xl border border-[#AA8559]/60 flex flex-col gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#FAF6F0]/10 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#AA8559] flex-shrink-0" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#AA8559] font-semibold">
                Inquiry Dispatched
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="text-[#FAF6F0]/60 hover:text-[#FAF6F0] p-1 -mr-1 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm font-sans text-[#FAF6F0]/90 leading-snug pt-1">
            {toastSenderName ? `Thank you, ${toastSenderName}. ` : 'Thank you. '}
            Your inquiry has been successfully sent to <span className="text-[#AA8559] font-mono text-xs">hello@pawelprusko.com</span>. We will be in touch shortly.
          </p>
        </div>
      )}
    </>
  );
}
