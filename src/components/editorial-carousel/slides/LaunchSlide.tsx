import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { WebsiteMockup } from '../WebsiteMockups';

interface LaunchSlideProps {
  isActive: boolean;
  prefersReducedMotion: boolean;
}

export function LaunchSlide({ isActive, prefersReducedMotion }: LaunchSlideProps) {
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setLaunched(false);
      return;
    }

    if (prefersReducedMotion) {
      setLaunched(true);
      return;
    }

    setLaunched(false);
    const timer = window.setTimeout(() => setLaunched(true), 520);
    return () => window.clearTimeout(timer);
  }, [isActive, prefersReducedMotion]);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black px-5 py-4 font-body text-white sm:px-8 sm:py-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Soft ambient luminance expanding on launch */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/2 h-[460px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_72%)] blur-[110px] transition-opacity duration-700 ${
            launched ? 'opacity-100' : 'opacity-45'
          }`}
        />
      </div>

      {/* Top Editorial Masthead */}
      <div className="relative z-10 flex flex-col gap-3 border-b border-white/15 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
          <span className="text-white">04 · Launch</span>
          <span>Refined &amp; Verified</span>
        </div>

        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl font-heading text-[clamp(2.1rem,min(4.2vw,6.4dvh),4rem)] font-normal leading-[0.94] tracking-tight text-white [text-wrap:balance]"
          >
            Then, it&apos;s out in the <span className="italic">world</span>.
          </motion.h2>
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[46ch] text-[14px] font-normal leading-[1.6] text-white/80"
          >
            After refinement, cross-device testing, and final accessibility checks, your website is
            ready to meet visitors with quiet confidence.
          </motion.p>
        </div>
      </div>

      {/* Clean Architectural Preview Frame + Precision Release Switch */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="relative z-10 my-auto flex flex-1 flex-col justify-center py-3 sm:py-4"
      >
        <div
          className={`relative flex h-full max-h-[54dvh] w-full flex-col overflow-hidden rounded-xl border bg-[#090909] transition-all duration-700 ${
            launched
              ? 'border-white/35 shadow-[0_32px_96px_rgba(0,0,0,0.95),0_0_40px_rgba(255,255,255,0.08)]'
              : 'border-white/15 shadow-[0_24px_72px_rgba(0,0,0,0.9)]'
          }`}
        >
          {/* Minimalist Studio Viewport Bar */}
          <div className="flex items-center justify-between gap-4 border-b border-white/15 bg-[#0e0e0e] px-4 py-2 sm:px-6">
            <div className="flex items-center gap-3 font-space-mono text-[11px] tracking-[0.1em] text-white/75">
              <span className="uppercase">Production Preview</span>
              <span aria-hidden="true" className="hidden text-white/35 sm:inline">
                /
              </span>
              <span className="hidden text-white/60 sm:inline">Release Build</span>
            </div>

            <button
              type="button"
              tabIndex={isActive ? 0 : -1}
              aria-pressed={launched}
              aria-label={
                launched
                  ? 'Release state: Live. Switch back to staging preview.'
                  : 'Release state: Staging. Switch to live launch preview.'
              }
              onClick={(e) => {
                e.stopPropagation();
                setLaunched((prev) => !prev);
              }}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-sm border px-3.5 py-1.5 font-space-mono text-[11px] tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                launched
                  ? 'border-white bg-white text-black'
                  : 'border-white/25 bg-black text-white/90 hover:border-white/60'
              }`}
            >
              <span>{launched ? 'Live' : 'Staging'}</span>
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Smooth Curtain Reveal into Full-Resolution Showcase */}
          <div aria-hidden="true" className="relative flex-1 overflow-hidden bg-black">
            <motion.div
              animate={{
                clipPath: launched ? 'inset(0% 0% 0% 0%)' : 'inset(3.5% 2.5% 4.5% 2.5%)',
                opacity: launched ? 1 : 0.72,
                scale: launched ? 1 : 0.988,
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
              }
              className="h-full w-full"
            >
              <WebsiteMockup direction="architecture" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quiet Editorial Footer Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-3 text-[11.5px] font-medium tracking-[0.12em] uppercase text-white/75">
        <span>Selected Production Build</span>
        <span className={launched ? 'text-white' : 'text-white/75'}>
          {launched ? 'Ready for Visitors' : 'Final Checks'}
        </span>
      </div>
    </div>
  );
}
