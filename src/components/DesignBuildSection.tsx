import { useRef } from 'react';
import { ArrowDown, ArrowRight, Code2, PenTool } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export function DesignBuildSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const shouldReduceMotion = !!useReducedMotion();

  const active = shouldReduceMotion || isInView;

  return (
    <section
      id="design-build"
      ref={sectionRef}
      aria-labelledby="design-build-heading"
      className="relative w-full bg-[#050505] py-20 text-[#F0ECE7] md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
        {/* Heading */}
        <div className="grid grid-cols-1 gap-8 border-b border-[#F0ECE7]/12 pb-12 lg:grid-cols-12 lg:items-end lg:pb-16">
          <div className="lg:col-span-7">
            <p className="mb-4 text-[12px] font-medium tracking-[0.14em] uppercase text-[#999999]">
              Design &amp; Build
            </p>
            <h2
              id="design-build-heading"
              className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-[#F0ECE7] [text-wrap:balance]"
            >
              Then, we bring it <span className="italic">to life.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pb-1">
            <p className="max-w-[46ch] text-[15px] leading-[1.65] text-[#999999] md:text-[16px]">
              With the direction established, we move into design and development — shaping every
              detail into a website that feels considered, works beautifully and represents your
              business.
            </p>
          </div>
        </div>

        {/* Two-Stage Creation Sequence */}
        <div className="relative mt-12 grid grid-cols-1 items-stretch gap-8 lg:mt-16 lg:grid-cols-11 lg:gap-6">
          {/* Stage 01 — Design */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={active ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.65, ease: EASE_EDITORIAL }}
            className="flex flex-col justify-between border border-[#292929] bg-[#0B0C10] p-7 md:p-10 lg:col-span-5"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#F0ECE7]/10 pb-5">
                <span className="font-serif text-4xl leading-none text-[#F0ECE7]/85 tabular-nums">
                  01
                </span>
                <motion.div
                  animate={
                    active && !shouldReduceMotion
                      ? { rotate: [0, -8, 0], scale: [1, 1.06, 1] }
                      : undefined
                  }
                  transition={{ duration: 0.9, delay: 0.25, ease: EASE_EDITORIAL }}
                  className="flex h-10 w-10 items-center justify-center border border-[#292929] bg-[#14151A]"
                >
                  <PenTool className="h-4 w-4 text-[#F0ECE7]" strokeWidth={1.5} />
                </motion.div>
              </div>

              <h3 className="mt-7 font-serif text-4xl font-normal text-[#F0ECE7]">Design</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-[#999999]">
                From structure and layouts to typography and visual details, we shape the complete
                experience around your brand.
              </p>
            </div>

            {/* Self-assembling interface layout blueprint */}
            <div
              aria-hidden="true"
              className="mt-8 border border-[#292929] bg-[#07080B] p-4"
            >
              <div className="flex items-center justify-between border-b border-white/8 pb-2.5">
                <motion.div
                  initial={shouldReduceMotion ? false : { scaleX: 0 }}
                  animate={active ? { scaleX: 1 } : undefined}
                  transition={{ duration: 0.5, delay: 0.2, ease: EASE_EDITORIAL }}
                  className="h-2 w-16 origin-left bg-[#F0ECE7]/30"
                />
                <div className="flex gap-2">
                  <span className="h-1.5 w-6 bg-white/15" />
                  <span className="h-1.5 w-6 bg-white/15" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-12 gap-3">
                <div className="col-span-7 space-y-2.5">
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                    animate={active ? { opacity: 1, x: 0 } : undefined}
                    transition={{ duration: 0.55, delay: 0.35, ease: EASE_EDITORIAL }}
                    className="h-3.5 w-4/5 bg-[#F0ECE7]/55"
                  />
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                    animate={active ? { opacity: 1, x: 0 } : undefined}
                    transition={{ duration: 0.55, delay: 0.45, ease: EASE_EDITORIAL }}
                    className="h-3.5 w-3/5 bg-[#F0ECE7]/35"
                  />
                  <motion.div
                    initial={shouldReduceMotion ? false : { scaleX: 0 }}
                    animate={active ? { scaleX: 1 } : undefined}
                    transition={{ duration: 0.5, delay: 0.55, ease: EASE_EDITORIAL }}
                    className="mt-3 h-5 w-20 origin-left bg-[#9F3035]"
                  />
                </div>
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
                  animate={active ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ duration: 0.65, delay: 0.4, ease: EASE_EDITORIAL }}
                  className="col-span-5 h-20 border border-white/12 bg-[#14161D]"
                />
              </div>
            </div>
          </motion.div>

          {/* Center Connector */}
          <div className="flex items-center justify-center py-2 lg:col-span-1 lg:py-0">
            <div className="flex items-center gap-2 lg:flex-col">
              <div className="h-px w-8 bg-[#F0ECE7]/20 lg:h-12 lg:w-px" />
              <motion.div
                animate={
                  active && !shouldReduceMotion
                    ? { x: [0, 4, 0] }
                    : undefined
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden h-9 w-9 items-center justify-center border border-[#292929] bg-[#0B0C10] lg:flex"
              >
                <ArrowRight className="h-4 w-4 text-[#9F3035]" />
              </motion.div>
              <div className="flex h-9 w-9 items-center justify-center border border-[#292929] bg-[#0B0C10] lg:hidden">
                <ArrowDown className="h-4 w-4 text-[#9F3035]" />
              </div>
              <div className="h-px w-8 bg-[#F0ECE7]/20 lg:h-12 lg:w-px" />
            </div>
          </div>

          {/* Stage 02 — Build */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={active ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.65, delay: 0.14, ease: EASE_EDITORIAL }}
            className="flex flex-col justify-between border border-[#292929] bg-[#0B0C10] p-7 md:p-10 lg:col-span-5"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#F0ECE7]/10 pb-5">
                <span className="font-serif text-4xl leading-none text-[#F0ECE7]/85 tabular-nums">
                  02
                </span>
                <motion.div
                  animate={
                    active && !shouldReduceMotion
                      ? { y: [0, -2, 0] }
                      : undefined
                  }
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex h-10 w-10 items-center justify-center border border-[#292929] bg-[#14151A]"
                >
                  <Code2 className="h-4 w-4 text-[#F0ECE7]" strokeWidth={1.5} />
                </motion.div>
              </div>

              <h3 className="mt-7 font-serif text-4xl font-normal text-[#F0ECE7]">Build</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-[#999999]">
                We turn the approved design into a responsive, functional website, carefully
                developed across devices and screen sizes.
              </p>
            </div>

            {/* Responsive code & viewport construction preview */}
            <div
              aria-hidden="true"
              className="mt-8 border border-[#292929] bg-[#07080B] p-4"
            >
              <div className="grid grid-cols-12 items-end gap-3">
                {/* Code construction lines */}
                <div className="col-span-7 space-y-2 border-r border-white/8 pr-3">
                  {[0.72, 0.9, 0.55, 0.84].map((widthRatio, idx) => (
                    <motion.div
                      key={idx}
                      initial={shouldReduceMotion ? false : { scaleX: 0 }}
                      animate={active ? { scaleX: 1 } : undefined}
                      transition={{
                        duration: 0.45,
                        delay: 0.35 + idx * 0.1,
                        ease: EASE_EDITORIAL,
                      }}
                      style={{ width: `${widthRatio * 100}%` }}
                      className={`h-1.5 origin-left ${
                        idx === 1 ? 'bg-[#9F3035]/80' : 'bg-[#F0ECE7]/25'
                      }`}
                    />
                  ))}
                </div>

                {/* Desktop + Mobile synced outlines */}
                <div className="col-span-5 flex items-end justify-end gap-2">
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={active ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.5, delay: 0.55, ease: EASE_EDITORIAL }}
                    className="h-14 w-16 border border-white/20 bg-[#12141B] p-1.5"
                  >
                    <div className="h-full w-full border border-white/10" />
                  </motion.div>
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={active ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.5, delay: 0.68, ease: EASE_EDITORIAL }}
                    className="h-11 w-6 border border-[#9F3035]/70 bg-[#12141B] p-1"
                  >
                    <div className="h-full w-full bg-white/10" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Connecting spine into Launch */}
      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto mt-16 flex max-w-[1440px] justify-center px-6 md:mt-20"
      >
        <div className="h-14 w-px bg-gradient-to-b from-[#F0ECE7]/15 to-[#9F3035]/70" />
      </div>
    </section>
  );
}
