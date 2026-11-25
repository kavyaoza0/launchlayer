import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WebsiteMockup, type MockupDirection } from '../WebsiteMockups';

interface CoverSlideProps {
  isActive: boolean;
  prefersReducedMotion: boolean;
}

interface DirectionItem {
  id: MockupDirection;
  index: string;
  label: string;
  discipline: string;
  craftNote: string;
  standard: string;
}

const DIRECTIONS: DirectionItem[] = [
  {
    id: 'architecture',
    index: '01',
    label: 'Architecture',
    discipline: 'Spatial Monograph',
    craftNote: 'Daylight contrast, structured calm, and full-bleed architectural framing.',
    standard: 'Spatial Rhythm',
  },
  {
    id: 'ecommerce',
    index: '02',
    label: 'Commerce',
    discipline: 'Direct-to-Consumer Storefront',
    craftNote: 'Editorial product staging, restrained bags, and distraction-free purchase flow.',
    standard: 'Conversion Craft',
  },
  {
    id: 'fintech',
    index: '03',
    label: 'Fintech',
    discipline: 'Product & Treasury Interface',
    craftNote: 'Tabular financial clarity and high-contrast dark surfaces for dense workflows.',
    standard: 'High-Density Precision',
  },
  {
    id: 'hardware',
    index: '04',
    label: 'Hardware',
    discipline: 'Industrial Flagship Launch',
    craftNote: 'Technical specification hierarchy paired with crisp reservation pathways.',
    standard: 'Launch Precision',
  },
  {
    id: 'lifestyle',
    index: '05',
    label: 'Hospitality',
    discipline: 'Atmosphere & Reservations',
    craftNote: 'Warm sensory typography and curated visual storytelling for cultural spaces.',
    standard: 'Brand Presence',
  },
];

const CYCLE_MS = 4600;

export function CoverSlide({ isActive, prefersReducedMotion }: CoverSlideProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (!isActive || prefersReducedMotion || isPinned) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DIRECTIONS.length);
    }, CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [isActive, prefersReducedMotion, isPinned]);

  const activeItem = DIRECTIONS[activeIndex];

  const handleSelectDirection = (idx: number) => {
    setActiveIndex(idx);
    setIsPinned(true);
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black px-5 py-4 font-body text-white sm:px-8 sm:py-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Subtle monochrome studio spotlight */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[10%] top-1/2 h-[460px] w-[720px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_72%)] blur-[110px]" />
      </div>

      {/* Top Editorial Masthead (Zero Pills) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-white/15 pb-3.5 text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-white">01 · Studio Perspective</span>
          <span aria-hidden="true" className="text-white/40">
            ·
          </span>
          <span className="hidden sm:inline">Web Design &amp; Development</span>
        </div>

        <div className="flex items-center gap-3 text-white/75">
          <span className="hidden md:inline">Ahmedabad · Worldwide</span>
          {isPinned && (
            <button
              type="button"
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                setIsPinned(false);
              }}
              className="min-h-[44px] border-b border-white/40 px-1 text-[11px] tracking-[0.14em] uppercase text-white/95 transition-colors hover:border-white hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Resume Cycle
            </button>
          )}
        </div>
      </div>

      {/* Main Gallery Composition: Balanced Editorial Statement + Curated Showcase Stage */}
      <div className="relative z-10 my-auto grid flex-1 grid-cols-1 items-center gap-6 py-4 sm:gap-8 lg:grid-cols-12 lg:gap-12 lg:py-6">
        {/* Left: Monumental Display Headline & Dynamic Direction Brief */}
        <div className="flex flex-col justify-center lg:col-span-5">
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 font-space-mono text-[11px] tracking-[0.22em] uppercase text-white/70 sm:mb-4"
          >
            LaunchLayer · Direction Study
          </motion.p>

          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[clamp(2.55rem,min(5.2vw,8dvh),5.15rem)] font-normal leading-[0.9] tracking-tight text-white [text-wrap:balance]"
          >
            A better way
            <br />
            <span className="italic text-white/95">to be seen.</span>
          </motion.h2>

          <div className="mt-5 min-h-[104px] border-t border-white/15 pt-4 sm:mt-7 sm:pt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-space-mono text-[11.5px] tracking-[0.14em] uppercase text-white">
                    {activeItem.index} · {activeItem.discipline}
                  </span>
                  <span className="font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/65 tabular-nums">
                    {activeItem.standard}
                  </span>
                </div>

                <p className="mt-2.5 max-w-[42ch] text-[14px] font-normal leading-[1.6] text-white/85 sm:text-[15px]">
                  {activeItem.craftNote}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Single Dominant Architectural Showcase Stage + Clean 5-Index Selector */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="flex flex-col justify-center lg:col-span-7"
        >
          {/* Elevated Gallery Frame */}
          <motion.button
            type="button"
            tabIndex={isActive ? 0 : -1}
            aria-label={`${activeItem.label} studio direction preview (${activeItem.discipline}). Activate to view next direction.`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectDirection((activeIndex + 1) % DIRECTIONS.length);
            }}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.006 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="group ll-glow-border-strong relative aspect-[16/10] w-full max-h-[44dvh] overflow-hidden rounded-xl border border-white/20 bg-[#080808] text-left transition-[border-color,box-shadow] duration-300 hover:border-white/45 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {/* Crossfading Live Showcase Surfaces */}
            {DIRECTIONS.map((item, idx) => {
              const current = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  aria-hidden="true"
                  className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    current
                      ? 'opacity-100 scale-100'
                      : 'pointer-events-none opacity-0 scale-[1.015]'
                  }`}
                >
                  <WebsiteMockup direction={item.id} />
                </div>
              );
            })}

            {/* Subtle top glass sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_44%)]"
            />
          </motion.button>

          {/* Clean Unboxed Architectural Index Strip (Zero Pills) */}
          <div
            role="group"
            aria-label="Select studio visual direction"
            className="mt-3 grid grid-cols-5 gap-2 sm:mt-4 sm:gap-3"
          >
            {DIRECTIONS.map((item, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-pressed={selected}
                  aria-label={`${item.index}: ${item.label} — ${item.discipline}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDirection(idx);
                  }}
                  className="group relative flex min-h-[44px] flex-col justify-center border-t border-white/20 pt-2 text-left transition-colors duration-200 hover:border-white/50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  {selected && (
                    <motion.span
                      layoutId="cover-direction-line"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 320, damping: 32 }
                      }
                      aria-hidden="true"
                      className="absolute inset-x-0 -top-px h-[1.5px] bg-white"
                    />
                  )}
                  <span
                    className={`font-space-mono text-[11px] tracking-[0.12em] tabular-nums transition-colors ${
                      selected ? 'text-white' : 'text-white/70 group-hover:text-white/95'
                    }`}
                  >
                    {item.index}
                  </span>
                  <span
                    className={`mt-0.5 truncate font-body text-[12px] font-medium tracking-[0.01em] transition-colors sm:text-[13px] ${
                      selected ? 'text-white' : 'text-white/75 group-hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quiet Unboxed Footer Metadata Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/15 pt-3 text-[11.5px] font-medium tracking-[0.12em] uppercase text-white/75">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-white/95">Custom Architecture</span>
          <span aria-hidden="true" className="text-white/40">
            /
          </span>
          <span className="text-white/95">Responsive Craft</span>
          <span aria-hidden="true" className="text-white/40">
            /
          </span>
          <span className="text-white">Sub-Second Performance</span>
        </div>

        <span className="font-space-mono text-[11px] tracking-[0.14em] text-white/70 tabular-nums">
          {activeItem.index} / 0{DIRECTIONS.length} · {activeItem.label}
        </span>
      </div>
    </div>
  );
}
