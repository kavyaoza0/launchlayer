import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface EndCardSlideProps {
  isActive: boolean;
  prefersReducedMotion?: boolean;
  onStartConversation: () => void;
}

export function EndCardSlide({
  isActive,
  prefersReducedMotion = false,
  onStartConversation,
}: EndCardSlideProps) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black px-5 py-4 font-body text-white sm:px-8 sm:py-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Serene monochrome studio aura behind final statement */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.075)_0%,transparent_72%)] blur-[110px]" />
      </div>

      {/* Top Editorial Masthead */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-3.5 text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
        <span className="text-white">07 · Next Chapter</span>
        <span className="text-white/90">Available for Select Projects</span>
      </div>

      {/* Centered Monumental Closing Statement */}
      <div className="relative z-10 mx-auto my-auto flex max-w-4xl flex-col items-center py-6 text-center sm:py-8">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 font-space-mono text-[11px] tracking-[0.2em] uppercase text-white/70"
        >
          LaunchLayer · Studio Enquiry
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[clamp(2.45rem,min(5.6vw,8.4dvh),5.25rem)] font-normal leading-[0.92] tracking-tight text-white [text-wrap:balance]"
        >
          Your next website starts with a <span className="italic">conversation</span>.
        </motion.h2>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-[46ch] text-[14.5px] font-normal leading-[1.65] text-white/80 sm:text-[15.5px]"
        >
          Have an idea, a brand, or something you want to bring online? Share what you are
          building, and let&apos;s find the right direction together.
        </motion.p>

        {/* Single Primary Liquid-Glass CTA + Direct Email Link */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onPointerDown={(e) => e.stopPropagation()}
          className="mt-7 flex flex-wrap items-center justify-center gap-6 sm:mt-9"
        >
          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              onStartConversation();
            }}
            className="liquid-glass-strong group inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-white/[0.06] px-8 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/15 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Book a Call</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>

          <a
            href="mailto:hello@launchlayer.in"
            tabIndex={isActive ? 0 : -1}
            aria-label="Email LaunchLayer studio at hello@launchlayer.in"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex min-h-[44px] items-center border-b border-white/40 px-1 text-[14px] font-medium text-white/90 transition-colors hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            hello@launchlayer.in
          </a>
        </motion.div>
      </div>

      {/* Quiet Studio Coordinates Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-3.5">
        <span className="font-heading text-[22px] leading-none text-white sm:text-[24px]">
          LaunchLayer
        </span>
        <span className="font-space-mono text-[11px] tracking-[0.14em] uppercase text-white/75">
          Ahmedabad, India · Working Worldwide
        </span>
      </div>
    </div>
  );
}
