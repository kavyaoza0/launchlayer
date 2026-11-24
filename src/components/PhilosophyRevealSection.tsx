import { Fragment, useEffect, useRef } from 'react';

const STATEMENT =
  "We don't just build websites. We shape the way your business is experienced, remembered, and discovered.";

const STATEMENT_WORDS = STATEMENT.split(' ');
const BASE_OPACITY = 0.16;

export function PhilosophyRevealSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReduced = motionQuery.matches;
    let rafId = 0;

    const applyReducedMotion = () => {
      for (let i = 0; i < STATEMENT_WORDS.length; i++) {
        const el = wordRefs.current[i];
        if (el) {
          el.style.opacity = '1';
        }
      }
    };

    const updateWords = () => {
      rafId = 0;
      if (prefersReduced) {
        applyReducedMotion();
        return;
      }

      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Illuminate smoothly as the section scrolls from lower viewport into reading center
      const startTop = vh * 0.82;
      const endTop = vh * 0.18;
      const rawProgress = (startTop - rect.top) / Math.max(startTop - endTop, 1);
      const progress = Math.max(0, Math.min(1, rawProgress));

      const total = STATEMENT_WORDS.length;
      const windowSpan = 0.24;

      for (let i = 0; i < total; i++) {
        const el = wordRefs.current[i];
        if (!el) continue;

        const wordStart = (i / Math.max(total - 1, 1)) * (1 - windowSpan);
        const localT = Math.max(0, Math.min(1, (progress - wordStart) / windowSpan));
        const smoothT = localT * localT * (3 - 2 * localT);
        const opacity = BASE_OPACITY + (1 - BASE_OPACITY) * smoothT;

        el.style.opacity = opacity.toFixed(3);
      }
    };

    const scheduleUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateWords);
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
      if (prefersReduced) {
        applyReducedMotion();
      } else {
        scheduleUpdate();
      }
    };

    updateWords();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <section
      id="studio"
      ref={sectionRef}
      aria-labelledby="philosophy-heading"
      className="ll-section-seam relative w-full bg-black py-16 text-white md:py-24"
    >
      {/* Soft monochrome ambient glow behind philosophy statement */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[380px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)] blur-[92px]" />
      </div>

      {/* Subtle fixed four-column structural grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16"
      >
        <div className="grid h-full grid-cols-4 border-x border-white/[0.06]">
          <div className="border-r border-white/[0.06]" />
          <div className="border-r border-white/[0.06]" />
          <div className="border-r border-white/[0.06]" />
          <div />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-4">
          <div className="col-span-4 mx-auto flex w-full max-w-[1240px] flex-col">
            <p className="mb-5 flex items-center gap-3 font-body text-[11px] font-medium tracking-[0.18em] uppercase text-white/60 md:mb-6 md:text-[12px]">
              <span aria-hidden="true" className="h-px w-6 bg-white/40" />
              A DIFFERENT WAY TO BUILD DIGITAL
            </p>

            <h2
              id="philosophy-heading"
              className="font-heading text-[clamp(36px,5.2vw,78px)] font-normal leading-[1.08] tracking-tight text-white [text-wrap:balance]"
            >
              <span className="sr-only">{STATEMENT}</span>
              <span aria-hidden="true">
                {STATEMENT_WORDS.map((word, index) => (
                  <Fragment key={`${word}-${index}`}>
                    <span
                      ref={(el) => {
                        wordRefs.current[index] = el;
                      }}
                      style={{
                        opacity: BASE_OPACITY,
                        transition: 'opacity 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="will-change-[opacity]"
                    >
                      {word}
                    </span>
                    {index < STATEMENT_WORDS.length - 1 ? ' ' : null}
                  </Fragment>
                ))}
              </span>
            </h2>

            <div className="relative mt-8 border-t border-white/10 pt-5 md:mt-10 md:pt-6">
              <p className="font-body text-[11px] font-light tracking-[0.18em] uppercase text-white/40 md:text-[12px]">
                LAUNCHLAYER · OUR PHILOSOPHY
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
