import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ProcessSlideProps {
  isActive: boolean;
  prefersReducedMotion: boolean;
}

const STEPS = [
  {
    num: '01',
    kicker: 'Foundation',
    title: 'The Basics',
    body: 'First, we get to know the essentials: your business, what you offer, where you stand today, and what you want to achieve.',
  },
  {
    num: '02',
    kicker: 'Perspective',
    title: 'Your Audience',
    body: 'We study the people you want to reach, what earns their trust, and what moves them to choose you over alternatives.',
  },
  {
    num: '03',
    kicker: 'Identity',
    title: 'Visual Direction',
    body: 'We gather your wordmark, palette, photography, and references to shape an aesthetic language that feels unmistakably yours.',
  },
  {
    num: '04',
    kicker: 'Architecture',
    title: 'Your Business',
    body: 'We map your services, products, and content hierarchy so every page serves a clear commercial purpose.',
  },
] as const;

export function ProcessSlide({ isActive, prefersReducedMotion }: ProcessSlideProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (!isActive || prefersReducedMotion || isPinned) return;

    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, [isActive, prefersReducedMotion, isPinned]);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black px-5 py-4 font-body text-white sm:px-8 sm:py-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Soft monochrome studio spotlight */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.055)_0%,transparent_72%)] blur-[104px]" />
      </div>

      {/* Top Editorial Masthead */}
      <div className="relative z-10 flex flex-col gap-3 border-b border-white/15 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
          <span className="text-white">02 · How We Work</span>
          <span>Four Steps, One Direction</span>
        </div>

        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl font-heading text-[clamp(2.1rem,min(4.2vw,6.4dvh),4rem)] font-normal leading-[0.94] tracking-tight text-white [text-wrap:balance]"
          >
            Every great website starts with <span className="italic">understanding</span>.
          </motion.h2>
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[44ch] text-[14px] font-normal leading-[1.6] text-white/80"
          >
            Before we design a single screen, we take the time to understand your business, your
            audience, and the direction you want to take.
          </motion.p>
        </div>
      </div>

      {/* Unboxed 4-Column Architectural Grid with Hairline Dividers */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="relative z-10 my-auto flex flex-1 flex-col justify-center py-4 sm:py-6"
      >
        <div className="grid grid-cols-1 divide-y divide-white/15 border-y border-white/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {STEPS.map((step, idx) => {
            const selected = activeStep === idx;
            return (
              <motion.button
                key={step.num}
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-pressed={selected}
                aria-label={`${step.num} — ${step.title}: ${step.body}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={isActive ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStep(idx);
                  setIsPinned(true);
                }}
                onMouseEnter={() => setActiveStep(idx)}
                className="group relative flex min-h-[44px] flex-col justify-between px-1 py-5 text-left transition-colors duration-300 hover:bg-white/[0.02] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-5 sm:py-6 lg:px-6 lg:py-8"
              >
                {/* Sliding Active Surface Wash & Top Hairline Indicator */}
                {selected && (
                  <>
                    <motion.span
                      layoutId="process-active-wash"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 260, damping: 30 }
                      }
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-white/[0.04]"
                    />
                    <motion.span
                      layoutId="process-active-bar"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 320, damping: 32 }
                      }
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-white"
                    />
                  </>
                )}

                <div className="relative z-10 flex items-baseline justify-between gap-3">
                  <span
                    className={`font-heading text-[2.25rem] leading-none tracking-tight transition-colors duration-300 sm:text-[2.75rem] ${
                      selected ? 'text-white' : 'text-white/55 group-hover:text-white/85'
                    }`}
                  >
                    {step.num}
                  </span>
                  <span className="font-space-mono text-[11px] tracking-[0.14em] uppercase text-white/65">
                    {step.kicker}
                  </span>
                </div>

                <div className="relative z-10 mt-5 sm:mt-8">
                  <h3
                    className={`font-heading text-[1.55rem] font-normal leading-tight tracking-tight transition-colors duration-300 sm:text-[1.75rem] ${
                      selected ? 'text-white' : 'text-white/85'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`mt-2.5 text-[13.5px] font-normal leading-[1.6] transition-colors duration-300 ${
                      selected ? 'text-white/90' : 'text-white/75'
                    }`}
                  >
                    {step.body}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quiet Editorial Footer Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-3 text-[11.5px] font-medium tracking-[0.12em] uppercase text-white/75">
        <span>Connected Discovery Track</span>
        <span className="font-space-mono tabular-nums text-white">
          Step {STEPS[activeStep].num} / 04 · {STEPS[activeStep].title}
        </span>
      </div>
    </div>
  );
}
