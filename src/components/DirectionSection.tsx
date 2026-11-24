import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { EnquiryTopic } from './Navbar';

interface DirectionSectionProps {
  onSelectDirection: (topic: EnquiryTopic) => void;
}

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

function SafeImage({
  src,
  alt,
  fallback,
  className = '',
}: {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={`h-full w-full ${className}`} style={{ background: fallback }} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] ${className}`}
    />
  );
}

export function DirectionSection({ onSelectDirection }: DirectionSectionProps) {
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <section
      id="directions"
      aria-labelledby="directions-heading"
      className="relative w-full bg-[#F0ECE7] py-24 text-[#050505] md:py-32 lg:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
        {/* Heading */}
        <div className="grid grid-cols-1 gap-8 border-b border-[#050505]/12 pb-12 lg:grid-cols-12 lg:items-end lg:pb-16">
          <div className="lg:col-span-7">
            <p className="mb-4 text-[12px] font-medium tracking-[0.14em] uppercase text-[#050505]/55">
              Plan Your Direction
            </p>
            <h2
              id="directions-heading"
              className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-[#050505] [text-wrap:balance]"
            >
              Let&apos;s find <span className="italic">your direction.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pb-1">
            <p className="max-w-[44ch] text-[15px] leading-[1.65] text-[#050505]/70 md:text-[16px]">
              Every business needs a different kind of digital experience. Explore a few directions
              and discover what your website could become.
            </p>
          </div>
        </div>

        {/* Curated Visual Directions — blank visual canvases, no external text/labels on mysterious previews */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12 lg:mt-16">
          {/* 1. Architectural Direction — matches the site brought live in the Launch section */}
          <motion.button
            type="button"
            onClick={() => onSelectDirection('Work')}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: EASE_EDITORIAL }}
            aria-label="Explore architectural website direction"
            className="group relative block overflow-hidden border border-[#050505]/15 bg-[#EFECE6] text-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:col-span-7 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9F3035]"
          >
            <div className="flex items-center gap-1.5 border-b border-[#050505]/10 bg-[#E6E2DA] px-4 py-2.5">
              <span className="h-1.5 w-1.5 bg-[#050505]/25" />
              <span className="h-1.5 w-1.5 bg-[#050505]/25" />
              <span className="h-1.5 w-1.5 bg-[#050505]/25" />
            </div>
            <div className="grid aspect-[16/10] grid-cols-12 items-center gap-4 p-5 sm:p-8">
              <div className="col-span-5 flex h-full flex-col justify-between py-2">
                <div className="h-2 w-12 bg-[#191816]/25" />
                <div className="space-y-2.5">
                  <div className="font-serif text-[22px] leading-[0.98] text-[#191816] sm:text-[32px]">
                    Spaces shaped by <span className="italic">daylight</span> and silence.
                  </div>
                  <div className="h-px w-14 bg-[#191816]/35" />
                </div>
                <div className="h-6 w-24 bg-[#191816]" />
              </div>
              <div className="col-span-7 h-full overflow-hidden border border-[#191816]/10 bg-[#DDD7CC]">
                <SafeImage
                  src="/src/assets/images/project_kanso_architecture_1795538724169.jpg"
                  alt="Minimalist architectural pavilion beside reflecting pool"
                  fallback="linear-gradient(135deg, #d7d0c3, #b5ab99)"
                />
              </div>
            </div>
          </motion.button>

          {/* 2. E-Commerce Direction — purely visual design only */}
          <motion.button
            type="button"
            onClick={() => onSelectDirection('Work')}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.08, ease: EASE_EDITORIAL }}
            aria-label="Explore e-commerce visual direction"
            className="group relative block overflow-hidden border border-[#050505]/15 bg-[#0E1913] text-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:col-span-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9F3035]"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0A130E] px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-1.5 w-1.5 bg-white/25" />
                <span className="h-1.5 w-1.5 bg-white/25" />
              </div>
              <div className="h-1.5 w-12 bg-[#C47F52]/50" />
            </div>
            <div className="grid aspect-[16/10] md:aspect-auto md:h-[calc(100%-29px)] grid-cols-12 gap-3 p-5 sm:p-6">
              <div className="col-span-7 overflow-hidden border border-white/10 bg-[#15241B]">
                <SafeImage
                  src="/src/assets/images/project_vespera_botanical_1795538724689.jpg"
                  alt="Amber glass dropper bottle on basalt stone"
                  fallback="linear-gradient(135deg, #16261d, #0a120d)"
                />
              </div>
              <div className="col-span-5 flex flex-col justify-between bg-[#15241B]/80 p-3.5">
                <div className="space-y-2">
                  <div className="h-1.5 w-10 bg-[#C47F52]/80" />
                  <div className="h-3 w-full bg-[#F3EDE2]/80" />
                  <div className="h-3 w-3/4 bg-[#F3EDE2]/60" />
                </div>
                <div className="space-y-2">
                  <div className="h-px w-full bg-[#F3EDE2]/15" />
                  <div className="h-6 w-full bg-[#C47F52]" />
                </div>
              </div>
            </div>
          </motion.button>

          {/* 3. Fintech & SaaS Direction — purely visual design only */}
          <motion.button
            type="button"
            onClick={() => onSelectDirection('Work')}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.12, ease: EASE_EDITORIAL }}
            aria-label="Explore fintech and software visual direction"
            className="group relative block overflow-hidden border border-[#050505]/15 bg-[#090C11] text-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:col-span-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9F3035]"
          >
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#0D1118] px-4 py-2.5">
              <span className="h-1.5 w-1.5 bg-white/25" />
              <span className="h-1.5 w-1.5 bg-white/25" />
            </div>
            <div className="flex aspect-[4/3] flex-col justify-between p-5">
              <div className="flex items-center justify-between">
                <div className="h-2.5 w-16 bg-white/75" />
                <div className="h-2 w-10 bg-[#34D399]/70" />
              </div>
              <div className="my-3 border border-white/10 bg-[#111620] p-3">
                <svg viewBox="0 0 180 60" className="h-14 w-full">
                  <path
                    d="M0 48 L30 42 L60 44 L90 28 L120 31 L150 14 L180 8"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-8 border border-white/10 bg-[#111620]" />
                <div className="h-8 border border-white/10 bg-[#111620]" />
                <div className="h-8 border border-white/10 bg-[#111620]" />
              </div>
            </div>
          </motion.button>

          {/* 4. Business Website Direction — purely visual design only */}
          <motion.button
            type="button"
            onClick={() => onSelectDirection('Work')}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE_EDITORIAL }}
            aria-label="Explore business website visual direction"
            className="group relative block overflow-hidden border border-[#050505]/15 bg-[#EAE7E0] text-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:col-span-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9F3035]"
          >
            <div className="flex items-center gap-1.5 border-b border-[#050505]/10 bg-[#DFDBD2] px-4 py-2.5">
              <span className="h-1.5 w-1.5 bg-[#050505]/25" />
              <span className="h-1.5 w-1.5 bg-[#050505]/25" />
            </div>
            <div className="flex aspect-[4/3] flex-col justify-between p-4">
              <div className="flex items-center justify-between pb-2">
                <div className="h-2.5 w-20 bg-[#050505]/75" />
                <div className="flex gap-2">
                  <span className="h-1.5 w-6 bg-[#050505]/25" />
                  <span className="h-1.5 w-6 bg-[#050505]/25" />
                </div>
              </div>
              <div className="relative flex-1 overflow-hidden border border-[#050505]/10 bg-[#D6D1C6]">
                <SafeImage
                  src="/src/assets/images/direction_corporate_studio_1795542742249.jpg"
                  alt="Timber and travertine executive studio interior"
                  fallback="linear-gradient(135deg, #d8d3c8, #b6b0a3)"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div className="h-2 w-28 bg-[#050505]/60" />
                <div className="h-5 w-16 bg-[#050505]" />
              </div>
            </div>
          </motion.button>

          {/* 5. Creative & Lifestyle Brand Direction — purely visual design only */}
          <motion.button
            type="button"
            onClick={() => onSelectDirection('Work')}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE_EDITORIAL }}
            aria-label="Explore creative and lifestyle brand visual direction"
            className="group relative block overflow-hidden border border-[#050505]/15 bg-[#141414] text-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:col-span-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9F3035]"
          >
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#1B1B1B] px-4 py-2.5">
              <span className="h-1.5 w-1.5 bg-white/25" />
              <span className="h-1.5 w-1.5 bg-white/25" />
            </div>
            <div className="grid aspect-[4/3] grid-cols-12 gap-3 p-4">
              <div className="col-span-5 flex flex-col justify-between py-1">
                <div className="h-2 w-12 bg-white/30" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-[#F0ECE7]/85" />
                  <div className="h-3.5 w-4/5 bg-[#F0ECE7]/55" />
                </div>
                <div className="h-px w-full bg-white/20" />
              </div>
              <div className="col-span-7 overflow-hidden border border-white/10 bg-[#222222]">
                <SafeImage
                  src="/src/assets/images/direction_editorial_fashion_1795542741389.jpg"
                  alt="Editorial tailoring in daylight concrete loft"
                  fallback="linear-gradient(135deg, #2b2b2b, #141414)"
                />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
