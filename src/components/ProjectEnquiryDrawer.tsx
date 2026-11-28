import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X, Check } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { EnquiryTopic } from './Navbar';

interface ProjectEnquiryDrawerProps {
  isOpen: boolean;
  initialTopic: EnquiryTopic;
  initialTier?: string;
  onClose: () => void;
}

type Currency = 'USD' | 'INR';

const TIERS = [
  { id: 'starter', name: 'Starter — One-page site', usd: '$249', inr: '₹19,999' },
  { id: 'business', name: 'Business — Up to 5 pages', usd: '$599', inr: '₹44,999' },
  { id: 'signature', name: 'Signature — Up to 8 pages', usd: '$1,199', inr: '₹89,999' },
  { id: 'bespoke', name: 'Bespoke — Custom build', usd: '$2,000+', inr: '₹1,50,000+' },
] as const;

const TOPIC_NOTES: Record<EnquiryTopic, string> = {
  General: 'Tell us a little about what you are building and when you would like to launch.',
  Work: 'We are putting together full project stories for our next update. Share what you need below and we will send over relevant examples.',
  Services:
    'We design and build landing pages, company websites, online stores, and custom web apps.',
  Pricing:
    'These starting prices give you a clear baseline. We will share an exact quote after a quick chat about what you need.',
  Studio: 'We are based in Ahmedabad and work closely with founders and teams everywhere.',
  Contact: 'Tell us a little about what you are building and when you would like to launch.',
};

export function ProjectEnquiryDrawer({
  isOpen,
  initialTopic,
  initialTier,
  onClose,
}: ProjectEnquiryDrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  const drawerPanelRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const [currency, setCurrency] = useState<Currency>('USD');
  const [selectedTier, setSelectedTier] = useState<string>(initialTier || 'business');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errorField, setErrorField] = useState<'name' | 'email' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && initialTier) {
      setSelectedTier(initialTier);
    }
  }, [isOpen, initialTier]);

  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      const focusTimer = window.setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 40);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSubmitted(false);
          setErrorMessage(null);
          setErrorField(null);
          onClose();
          return;
        }
        if (e.key === 'Tab' && drawerPanelRef.current) {
          const focusables = drawerPanelRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.clearTimeout(focusTimer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      setErrorField('name');
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorField('email');
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorField(null);
    setErrorMessage(null);
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setErrorField(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Panel */}
          <motion.aside
            ref={drawerPanelRef}
            initial={shouldReduceMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-lg flex-col justify-between overflow-y-auto border-l border-white/15 bg-black p-6 font-body text-white shadow-[-24px_0_70px_rgba(0,0,0,0.95)] md:p-10"
          >
            <div>
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <p className="text-[12.5px] font-medium tracking-[0.02em] text-white/80">
                    Tesselo · {initialTopic === 'General' ? 'New Project' : initialTopic}
                  </p>
                  <h2
                    id="enquiry-title"
                    className="mt-2 font-heading text-4xl leading-none tracking-tight text-white"
                  >
                    Start a <span className="italic text-white">conversation</span>
                  </h2>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={resetAndClose}
                  aria-label="Close project enquiry panel"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/85 transition-colors duration-150 hover:border-white/60 hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <p className="mt-5 text-[14px] font-normal leading-relaxed text-white/80">
                {TOPIC_NOTES[initialTopic]}
              </p>

              {submitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="apple-liquid-glass mt-8 rounded-[24px] p-6"
                >
                  <div className="flex items-center gap-2.5 text-white">
                    <Check aria-hidden="true" className="h-4 w-4 text-white" />
                    <span className="text-[15px] font-medium">Thanks, we got your message</span>
                  </div>
                  <p className="mt-3 text-[14px] font-normal leading-relaxed text-white/85">
                    Thank you, {name}. We usually reply within one business day from{' '}
                    <span className="text-white">hello@tesselo.in</span>.
                  </p>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="apple-liquid-pill mt-6 min-h-[44px] rounded-full px-6 py-2.5 text-[13px] font-medium text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Back to site
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <span id="scope-label" className="text-[13px] font-medium text-white/95">
                        Which option fits best?
                      </span>
                      <div
                        role="group"
                        aria-label="Currency selector"
                        className="inline-flex rounded-full border border-white/20 bg-white/[0.03] p-0.5"
                      >
                        {(['USD', 'INR'] as const).map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            aria-pressed={currency === curr}
                            onClick={() => setCurrency(curr)}
                            className={`min-h-[36px] rounded-full px-3.5 py-1 text-[12px] font-medium transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                              currency === curr
                                ? 'bg-white text-black'
                                : 'text-white/85 hover:text-white'
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div role="radiogroup" aria-labelledby="scope-label" className="grid grid-cols-1 gap-2">
                      {TIERS.map((tier, idx) => {
                        const active = selectedTier === tier.id;
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            tabIndex={active ? 0 : -1}
                            onClick={() => setSelectedTier(tier.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                                e.preventDefault();
                                const next = TIERS[(idx + 1) % TIERS.length];
                                setSelectedTier(next.id);
                                const nextEl = e.currentTarget.parentElement?.children[(idx + 1) % TIERS.length] as HTMLElement | undefined;
                                nextEl?.focus();
                              } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                                e.preventDefault();
                                const prev = TIERS[(idx - 1 + TIERS.length) % TIERS.length];
                                setSelectedTier(prev.id);
                                const prevEl = e.currentTarget.parentElement?.children[(idx - 1 + TIERS.length) % TIERS.length] as HTMLElement | undefined;
                                prevEl?.focus();
                              }
                            }}
                            className={`flex min-h-[44px] items-center justify-between rounded-xl border px-4 py-3 text-left text-[13.5px] transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                              active
                                ? 'border-white/65 bg-white/[0.1] text-white'
                                : 'border-white/20 bg-transparent text-white/85 hover:border-white/45 hover:text-white'
                            }`}
                          >
                            <span className="font-medium">{tier.name}</span>
                            <span className={`tabular-nums ${active ? 'text-white' : 'text-white/90'}`}>
                              {currency === 'USD' ? tier.usd : tier.inr}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="mb-1.5 block text-[13px] font-medium text-white/95"
                    >
                      Your name
                    </label>
                    <input
                      id="enquiry-name"
                      type="text"
                      required
                      aria-invalid={errorField === 'name'}
                      aria-describedby={errorField === 'name' ? 'enquiry-error' : undefined}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aarav Mehta"
                      className={`min-h-[44px] w-full rounded-xl border bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-white placeholder-white/60 transition-colors focus:border-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        errorField === 'name' ? 'border-red-300/80' : 'border-white/25'
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-email"
                      className="mb-1.5 block text-[13px] font-medium text-white/95"
                    >
                      Email address
                    </label>
                    <input
                      id="enquiry-email"
                      type="email"
                      required
                      aria-invalid={errorField === 'email'}
                      aria-describedby={errorField === 'email' ? 'enquiry-error' : undefined}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className={`min-h-[44px] w-full rounded-xl border bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-white placeholder-white/60 transition-colors focus:border-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        errorField === 'email' ? 'border-red-300/80' : 'border-white/25'
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-notes"
                      className="mb-1.5 block text-[13px] font-medium text-white/95"
                    >
                      Tell us about your project
                    </label>
                    <textarea
                      id="enquiry-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="A few lines on what you need, pages or features, and timing."
                      className="w-full resize-none rounded-xl border border-white/25 bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-white placeholder-white/60 transition-colors focus:border-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    />
                  </div>

                  {errorMessage && (
                    <p id="enquiry-error" role="alert" className="text-[13px] font-medium text-red-300">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="min-h-[44px] w-full rounded-full bg-white px-6 py-3 text-[13.5px] font-medium text-black transition-colors duration-150 hover:bg-white/90 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>

            <div className="mt-8 border-t border-white/15 pt-4 text-[12.5px] font-normal text-white/75">
              Based in Ahmedabad, India · Working with clients worldwide · Direct:{' '}
              <a
                href="mailto:hello@tesselo.in"
                className="text-white underline underline-offset-4 hover:text-white/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                hello@tesselo.in
              </a>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
