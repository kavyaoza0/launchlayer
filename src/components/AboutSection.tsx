import { motion, useReducedMotion } from 'motion/react';

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export function AboutSection() {
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full border-t border-[#F0ECE7]/10 bg-[#08090D] py-24 text-[#F0ECE7] md:py-32 lg:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="text-[12px] font-medium tracking-[0.14em] uppercase text-[#999999]">
              About Studio
            </p>
          </div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            className="lg:col-span-9"
          >
            <h2
              id="about-heading"
              className="max-w-3xl font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.03] tracking-[-0.02em] text-[#F0ECE7] [text-wrap:balance]"
            >
              Small studio. <span className="italic">Big attention</span> to detail.
            </h2>

            <p className="mt-8 max-w-[56ch] text-[16px] leading-[1.7] text-[#F0ECE7]/80 md:text-[18px]">
              LaunchLayer is a web design and development studio focused on creating thoughtful
              digital experiences for businesses. We combine design, technology and a clear
              understanding of business goals to build websites that look distinctive and work with
              purpose.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 border-t border-[#F0ECE7]/12 pt-8 text-[13.5px] text-[#999999] sm:grid-cols-3">
              <div>
                <span className="block text-[11px] uppercase tracking-[0.12em] text-[#999999]/70">
                  Base
                </span>
                <span className="mt-1.5 block text-[#F0ECE7]">Ahmedabad, India</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-[0.12em] text-[#999999]/70">
                  Reach
                </span>
                <span className="mt-1.5 block text-[#F0ECE7]">Working Worldwide</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-[0.12em] text-[#999999]/70">
                  Practice
                </span>
                <span className="mt-1.5 block text-[#F0ECE7]">Design &amp; Development</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
