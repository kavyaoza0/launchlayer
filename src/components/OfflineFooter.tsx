import type { PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Check } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { EnquiryTopic } from './Navbar';

interface OfflineFooterProps {
  onOpenEnquiry: (topic?: EnquiryTopic, tierId?: string) => void;
}

type PolicyKind = 'privacy' | 'cookies' | null;

const EASE = [0.16, 1, 0.3, 1] as const;

const STUDIO_COLUMN = [
  { label: 'Work', target: 'work' },
  { label: 'Philosophy', target: 'studio' },
] as const;

const PROCESS_COLUMN = [
  { label: 'How We Work', target: 'presentation' },
  { label: 'Pricing', target: 'pricing' },
] as const;

const PACKAGE_TIERS = [
  { id: 'starter', label: 'Starter · $249' },
  { id: 'business', label: 'Business · $599' },
  { id: 'signature', label: 'Signature · $1,199' },
  { id: 'bespoke', label: 'Bespoke · $2,000+' },
] as const;

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com', ariaLabel: 'LinkedIn (opens in a new tab)' },
  { label: 'Instagram', href: 'https://www.instagram.com', ariaLabel: 'Instagram (opens in a new tab)' },
  { label: 'X', href: 'https://x.com', ariaLabel: 'X (opens in a new tab)' },
] as const;

function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function OfflineFooter({ onOpenEnquiry }: OfflineFooterProps) {
  const shouldReduceMotion = !!useReducedMotion();
  const [activePolicy, setActivePolicy] = useState<PolicyKind>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  const policyCloseRef = useRef<HTMLButtonElement | null>(null);
  const lastPolicyTriggerRef = useRef<HTMLElement | null>(null);

  // Subtle interactive ambient light following cursor inside the editorial stage
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rawX = useMotionValue(50);
  const rawY = useMotionValue(46);
  const glowX = useSpring(rawX, { stiffness: 90, damping: 24, mass: 0.8 });
  const glowY = useSpring(rawY, { stiffness: 90, damping: 24, mass: 0.8 });
  const radialSpotlight = useMotionTemplate`radial-gradient(520px circle at ${glowX}% ${glowY}%, rgba(100, 206, 251, 0.085) 0%, rgba(255, 255, 255, 0.03) 36%, transparent 72%)`;

  useEffect(() => {
    if (!emailCopied) return;
    const t = window.setTimeout(() => setEmailCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [emailCopied]);

  useEffect(() => {
    if (!activePolicy) {
      if (lastPolicyTriggerRef.current) {
        lastPolicyTriggerRef.current.focus();
        lastPolicyTriggerRef.current = null;
      }
      return;
    }
    lastPolicyTriggerRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => policyCloseRef.current?.focus(), 20);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePolicy(null);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        policyCloseRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activePolicy]);

  const handleStagePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || e.pointerType === 'touch') return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return;
    const xPct = Math.max(15, Math.min(85, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(15, Math.min(85, ((e.clientY - rect.top) / rect.height) * 100));
    rawX.set(xPct);
    rawY.set(yPct);
  };

  const handleStagePointerLeave = () => {
    rawX.set(50);
    rawY.set(46);
  };

  const handleCopyEmail = () => {
    const email = 'hello@launchlayer.in';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    setEmailCopied(true);
  };

  return (
    <footer
      aria-label="LaunchLayer Footer"
      className="ll-section-seam relative w-full overflow-hidden bg-black font-body text-white"
    >
      {/* Top Heroic Editorial Typography Stage */}
      <div
        ref={stageRef}
        onPointerMove={handleStagePointerMove}
        onPointerLeave={handleStagePointerLeave}
        className="relative flex w-full flex-col items-center justify-center px-5 pt-24 pb-20 sm:px-8 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28"
      >
        {/* Interactive subtle cursor-tracked illumination (pure radial light, no imagery) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={
            shouldReduceMotion
              ? {
                  background:
                    'radial-gradient(520px circle at 50% 46%, rgba(100, 206, 251, 0.06) 0%, transparent 70%)',
                }
              : { backgroundImage: radialSpotlight }
          }
        />

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="relative z-10 flex w-full max-w-[920px] flex-col items-center text-center"
        >
          {/* Mixed Condensed High-Contrast Serif + Prismatic Calligraphic Lockup */}
          <h2 className="flex flex-col items-center select-none">
            <span className="font-heading text-[clamp(1.75rem,3.4vw,2.75rem)] font-normal uppercase leading-[0.88] tracking-[-0.025em] text-white/95 translate-x-[12%] sm:translate-x-[16%]">
              Make Your
            </span>
            <span className="-mt-0.5 font-heading text-[clamp(2.3rem,5vw,4.1rem)] font-normal uppercase leading-[0.84] tracking-[-0.03em] text-white -translate-x-[12%] sm:-translate-x-[15%]">
              Presence
            </span>

            {/* Flowing Calligraphic Focal Word with Iridescent Pearl Foil Sheen */}
            <span className="relative -mt-3 -mb-2 px-6 py-2 sm:-mt-6 sm:-mb-3 sm:px-10 lg:-mt-7">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-1/2 h-12 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(100,206,251,0.16)_0%,transparent_72%)] blur-2xl"
              />
              <span className="ll-script-shimmer relative inline-block font-script text-[clamp(4.1rem,11.5vw,9.2rem)] font-normal leading-[0.86] tracking-[0.01em] drop-shadow-[0_10px_28px_rgba(0,0,0,0.9)]">
                Remarkable
              </span>
            </span>

            <span className="font-heading text-[clamp(2rem,4.3vw,3.55rem)] font-normal uppercase leading-[0.84] tracking-[-0.03em] text-white/95 translate-x-[10%] sm:translate-x-[16%]">
              Worldwide
            </span>
          </h2>

          {/* Single Centered Obsidian Glass Pill CTA */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
            className="mt-9 flex flex-col items-center gap-4 sm:mt-11"
          >
            <button
              type="button"
              onClick={() => onOpenEnquiry('General')}
              className="group relative inline-flex min-h-[46px] items-center gap-3 rounded-full border border-white/20 bg-[#0B0C10]/90 px-7 py-3 font-space-mono text-[12px] tracking-[0.16em] uppercase text-white shadow-[0_12px_32px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300 hover:border-[#64CEFB]/60 hover:bg-[#11131A] hover:shadow-[0_14px_40px_rgba(100,206,251,0.14),inset_0_1px_0_rgba(255,255,255,0.28)] whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 text-white/80 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#64CEFB]"
                aria-hidden="true"
              />
            </button>

            {/* Whisper-quiet unboxed studio line & inline copy email action */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-space-mono text-[11px] tracking-[0.08em] text-white/60">
              <span>Ahmedabad · Partnering Worldwide</span>
              <span aria-hidden="true" className="text-white/25">
                ·
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy hello@launchlayer.in email address"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-white/75 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-[#64CEFB] cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {emailCopied ? (
                  <>
                    <Check className="h-3 w-3 text-[#64CEFB]" aria-hidden="true" />
                    <span className="text-[#64CEFB]">Copied hello@launchlayer.in</span>
                  </>
                ) : (
                  <span>hello@launchlayer.in</span>
                )}
              </button>
              <span className="sr-only" aria-live="polite">
                {emailCopied ? 'Email hello@launchlayer.in copied to clipboard' : ''}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom 5-Column Architectural Directory */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pt-4 pb-10 sm:px-8 sm:pb-12 lg:px-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/[0.08] pt-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-10 lg:pt-14">
          {/* Column 1: Studio */}
          <div>
            <h3 className="mb-3 font-space-mono text-[10.5px] font-normal tracking-[0.18em] uppercase text-white/45">
              Studio
            </h3>
            <ul>
              {STUDIO_COLUMN.map((item) => (
                <li key={item.target}>
                  <a
                    href={`#${item.target}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(item.target);
                    }}
                    className="group inline-flex min-h-[44px] items-center font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/85 transition-colors hover:text-white rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span className="relative py-0.5">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Process */}
          <div>
            <h3 className="mb-3 font-space-mono text-[10.5px] font-normal tracking-[0.18em] uppercase text-white/45">
              Process
            </h3>
            <ul>
              {PROCESS_COLUMN.map((item) => (
                <li key={item.target}>
                  <a
                    href={`#${item.target}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(item.target);
                    }}
                    className="group inline-flex min-h-[44px] items-center font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/85 transition-colors hover:text-white rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span className="relative py-0.5">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Packages */}
          <div>
            <h3 className="mb-3 font-space-mono text-[10.5px] font-normal tracking-[0.18em] uppercase text-white/45">
              Packages
            </h3>
            <ul>
              {PACKAGE_TIERS.map((tier) => (
                <li key={tier.id}>
                  <button
                    type="button"
                    onClick={() => onOpenEnquiry('Pricing', tier.id)}
                    className="group inline-flex min-h-[44px] items-center text-left font-space-mono text-[11px] tracking-[0.1em] uppercase text-white/85 transition-colors hover:text-[#64CEFB] tabular-nums cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span className="relative py-0.5">
                      {tier.label}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-[#64CEFB] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct & Legal */}
          <div>
            <h3 className="mb-3 font-space-mono text-[10.5px] font-normal tracking-[0.18em] uppercase text-white/45">
              Inquiries
            </h3>
            <ul>
              <li>
                <a
                  href="mailto:hello@launchlayer.in"
                  className="group inline-flex min-h-[44px] items-center font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/85 transition-colors hover:text-white rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span className="relative py-0.5">
                    Email Studio
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                    />
                  </span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('privacy')}
                  className="group inline-flex min-h-[44px] items-center font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/85 transition-colors hover:text-white cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span className="relative py-0.5">
                    Privacy
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                    />
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('cookies')}
                  className="group inline-flex min-h-[44px] items-center font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/85 transition-colors hover:text-white cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span className="relative py-0.5">
                    Cookies
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                    />
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Social */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-3 font-space-mono text-[10.5px] font-normal tracking-[0.18em] uppercase text-white/45">
              Social
            </h3>
            <ul className="flex flex-wrap gap-x-6 sm:block">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="group inline-flex min-h-[44px] items-center gap-1.5 font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/85 transition-colors hover:text-white rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span className="relative py-0.5">
                      {social.label}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                      />
                    </span>
                    <ArrowUpRight
                      className="h-3 w-3 text-white/45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Minimal Ground Bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/[0.1] pt-6 sm:flex-row sm:items-center">
          <p className="text-[13px] tracking-[0.01em] text-white/60">
            © 2026 LaunchLayer. Designed and built with care.
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="group inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-medium tracking-[0.01em] text-white/85 transition-colors hover:text-white cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Back to top</span>
            <ArrowUp
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Accessible Legal Info Modal */}
      {activePolicy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-dialog-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setActivePolicy(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/20 bg-[#0A0B0F] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 id="policy-dialog-title" className="font-heading text-2xl font-normal text-white">
                {activePolicy === 'privacy' ? 'Privacy Policy' : 'Cookie Policy'}
              </h3>
              <button
                ref={policyCloseRef}
                type="button"
                onClick={() => setActivePolicy(null)}
                className="min-h-[44px] rounded-full border border-white/25 px-4 py-2 text-xs font-medium text-white transition hover:border-white/60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Close
              </button>
            </div>
            <p className="text-sm leading-relaxed text-white/85">
              {activePolicy === 'privacy'
                ? 'LaunchLayer collects only project enquiry details you explicitly submit via email or our enquiry form. We never sell personal data or track browsing across third-party websites.'
                : 'This LaunchLayer website uses strictly necessary browser state to preserve smooth animation and accessibility preferences. No third-party advertising cookies are stored.'}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}

export default OfflineFooter;
