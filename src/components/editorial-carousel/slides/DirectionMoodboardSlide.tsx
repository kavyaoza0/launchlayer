import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WebsiteMockup, type MockupDirection } from '../WebsiteMockups';

interface DirectionMoodboardSlideProps {
  isActive: boolean;
  prefersReducedMotion?: boolean;
}

interface DirectionProfile {
  id: MockupDirection;
  index: string;
  name: string;
  paletteTitle: string;
  atmosphere: string;
  typography: string;
  swatchClasses: [string, string, string];
  auraClass: string;
}

const DIRECTIONS: DirectionProfile[] = [
  {
    id: 'architecture',
    index: '01',
    name: 'Architecture',
    paletteTitle: 'Warm Limestone & Daylight',
    atmosphere: 'Quiet architectural poise, generous negative space, and calm editorial pacing.',
    typography: 'High-contrast serif headings with restrained geometric captions.',
    swatchClasses: ['bg-[#EFECE6]', 'bg-[#C8BEB0]', 'bg-[#191816]'],
    auraClass: 'bg-[radial-gradient(ellipse_at_center,rgba(239,236,230,0.11)_0%,transparent_72%)]',
  },
  {
    id: 'ecommerce',
    index: '02',
    name: 'Commerce',
    paletteTitle: 'Deep Botanical & Amber',
    atmosphere: 'Tactile product staging with nocturnal warmth and effortless purchase focus.',
    typography: 'Expressive serif titles paired with crisp tabular sizing details.',
    swatchClasses: ['bg-[#0E1913]', 'bg-[#C47F52]', 'bg-[#F3EDE2]'],
    auraClass: 'bg-[radial-gradient(ellipse_at_center,rgba(196,127,82,0.13)_0%,transparent_72%)]',
  },
  {
    id: 'fintech',
    index: '03',
    name: 'Fintech',
    paletteTitle: 'Obsidian & Crisp Telemetry',
    atmosphere: 'Engineered dark-mode precision built for high-trust financial clarity.',
    typography: 'Clean geometric numerals anchored by structured hairline tables.',
    swatchClasses: ['bg-[#090C11]', 'bg-[#34D399]', 'bg-[#E8EEF7]'],
    auraClass: 'bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.10)_0%,transparent_72%)]',
  },
  {
    id: 'hardware',
    index: '04',
    name: 'Hardware',
    paletteTitle: 'Anodized Alloy & Signal Red',
    atmosphere: 'Industrial flagship presence pairing matte metallic surfaces with technical rigor.',
    typography: 'Tight neo-grotesque headlines balanced with measured specification grids.',
    swatchClasses: ['bg-[#E4E5E7]', 'bg-[#D93829]', 'bg-[#151618]'],
    auraClass: 'bg-[radial-gradient(ellipse_at_center,rgba(228,229,231,0.10)_0%,transparent_72%)]',
  },
  {
    id: 'lifestyle',
    index: '05',
    name: 'Hospitality',
    paletteTitle: 'Charred Oak & Terracotta',
    atmosphere: 'Intimate sensory warmth crafted for cultural spaces, dining, and editorial brands.',
    typography: 'Soft humanist serifs accompanied by unhurried organic rhythm.',
    swatchClasses: ['bg-[#1A1310]', 'bg-[#C06342]', 'bg-[#F2E9DC]'],
    auraClass: 'bg-[radial-gradient(ellipse_at_center,rgba(192,99,66,0.12)_0%,transparent_72%)]',
  },
];

function circularOffset(index: number, active: number, total: number): number {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

export function DirectionMoodboardSlide({
  isActive,
  prefersReducedMotion = false,
}: DirectionMoodboardSlideProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  // Subtle auto-choreographed lookbook glide until the visitor inspects a direction
  useEffect(() => {
    if (!isActive || prefersReducedMotion || isPinned) return;
    const timer = window.setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % DIRECTIONS.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [isActive, prefersReducedMotion, isPinned]);

  const current = DIRECTIONS[selectedIndex];

  const selectDirection = (idx: number) => {
    setSelectedIndex(((idx % DIRECTIONS.length) + DIRECTIONS.length) % DIRECTIONS.length);
    setIsPinned(true);
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black px-5 py-4 font-body text-white sm:px-8 sm:py-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Reactive Atmospheric Aura keyed to Active Visual World */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute right-[6%] top-1/2 h-[480px] w-[780px] -translate-y-1/2 rounded-full blur-[115px] ${current.auraClass}`}
          />
        </AnimatePresence>
      </div>

      {/* Top Editorial Masthead */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-3.5 text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
        <span className="text-white">05 · Creative Direction</span>
        <div className="flex items-center gap-4">
          {isPinned && (
            <button
              type="button"
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                setIsPinned(false);
              }}
              className="min-h-[44px] border-b border-white/35 px-1 text-[11px] tracking-[0.14em] uppercase text-white/90 transition-colors hover:border-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Auto-Glide
            </button>
          )}
          <span className="font-space-mono text-[11px] tracking-[0.14em] text-white/80 tabular-nums">
            {current.index} / 0{DIRECTIONS.length} · {current.name}
          </span>
        </div>
      </div>

      {/* Spatial Exhibition Split: Monograph Notes + 3D Depth Deck */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="relative z-10 my-auto grid flex-1 grid-cols-1 items-center gap-6 py-4 sm:gap-8 lg:grid-cols-12 lg:gap-12 lg:py-5"
      >
        {/* Left: Monumental Typography + Animated Monograph Reader */}
        <div className="flex flex-col justify-center lg:col-span-5">
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[clamp(2.2rem,min(4.4vw,6.8dvh),4.35rem)] font-normal leading-[0.92] tracking-tight text-white [text-wrap:balance]"
          >
            Your business.
            <br />
            A <span className="italic">different</span> digital direction.
          </motion.h2>

          <p className="mt-4 max-w-[42ch] text-[14px] font-normal leading-[1.6] text-white/80 sm:text-[15px]">
            Every brand carries a distinct visual tone. Glide across five bespoke atmospheres to
            see how space, color, and type transform identity.
          </p>

          {/* Animated Monograph Inspector */}
          <div className="mt-6 min-h-[144px] border-t border-white/15 pt-4 sm:mt-7 sm:pt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="font-space-mono text-[11px] tracking-[0.14em] uppercase text-white/65">
                      {current.index} · {current.name}
                    </span>
                    <h3 className="mt-1 font-heading text-[1.55rem] font-normal leading-none text-white sm:text-[1.75rem]">
                      {current.paletteTitle}
                    </h3>
                  </div>

                  {/* Animated Geometric Swatch Trio */}
                  <div aria-hidden="true" className="flex items-center gap-1.5 shrink-0">
                    {current.swatchClasses.map((bgClass, sIdx) => (
                      <motion.span
                        key={bgClass}
                        initial={prefersReducedMotion ? false : { scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: sIdx * 0.04, duration: 0.25 }}
                        className={`h-5 w-5 rounded-sm border border-white/25 ${bgClass}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-2.5 text-[13.5px] font-normal leading-[1.6] text-white/85">
                  {current.atmosphere}
                </p>
                <p className="mt-1.5 font-space-mono text-[11px] tracking-[0.06em] text-white/65">
                  {current.typography}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Clean 3D Spatial Depth Lookbook Deck + Editorial Index Rail */}
        <div className="flex flex-col justify-center lg:col-span-7">
          {/* Interactive Layered Spatial Deck */}
          <div
            className="relative flex h-[clamp(220px,38dvh,380px)] w-full items-center justify-center [perspective:1400px]"
          >
            {DIRECTIONS.map((dir, idx) => {
              const offset = circularOffset(idx, selectedIndex, DIRECTIONS.length);
              const absOffset = Math.abs(offset);
              const isFront = offset === 0;
              const isVisible = absOffset <= 2;

              return (
                <motion.button
                  key={dir.id}
                  type="button"
                  tabIndex={isActive && isFront ? 0 : -1}
                  aria-hidden={!isFront && absOffset > 1 ? true : undefined}
                  aria-label={
                    isFront
                      ? `${dir.name} visual world (${dir.paletteTitle}). Activate to view next direction.`
                      : `Bring ${dir.name} visual world to center.`
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isFront) {
                      selectDirection(selectedIndex + 1);
                    } else {
                      selectDirection(idx);
                    }
                  }}
                  animate={{
                    x: offset * 68,
                    y: absOffset * 4,
                    scale: isFront ? 1 : absOffset === 1 ? 0.88 : 0.76,
                    rotateY: offset * -10,
                    opacity: !isVisible ? 0 : isFront ? 1 : absOffset === 1 ? 0.56 : 0.22,
                    zIndex: 30 - absOffset * 8,
                  }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 195, damping: 25, mass: 0.9 }
                  }
                  className={`absolute aspect-[16/10] w-[76%] max-w-[540px] overflow-hidden rounded-xl border bg-[#090909] text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-[74%] ${
                    isFront
                      ? 'border-white/35 shadow-[0_36px_96px_rgba(0,0,0,0.95),0_0_32px_rgba(255,255,255,0.08)]'
                      : 'border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] hover:border-white/40'
                  }`}
                >
                  <div aria-hidden="true" className="h-full w-full">
                    <WebsiteMockup direction={dir.id} />
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_44%)]"
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Clean Unboxed Architectural Index Strip with Sliding Top Hairline */}
          <div
            role="group"
            aria-label="Choose visual direction"
            className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible sm:pb-0"
          >
            {DIRECTIONS.map((dir, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={dir.id}
                  type="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-pressed={active}
                  aria-label={`${dir.index}: ${dir.name} — ${dir.paletteTitle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectDirection(idx);
                  }}
                  className="group relative flex min-h-[44px] min-w-[92px] shrink-0 flex-col justify-center border-t border-white/15 pt-2 text-left transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-w-0"
                >
                  {active && (
                    <motion.span
                      layoutId="direction-deck-indicator"
                      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                      className="absolute inset-x-0 -top-px h-[1.5px] bg-white"
                    />
                  )}
                  <span
                    className={`font-space-mono text-[10.5px] tracking-[0.12em] tabular-nums transition-colors ${
                      active ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                    }`}
                  >
                    {dir.index}
                  </span>
                  <span
                    className={`mt-0.5 truncate font-body text-[12px] font-medium transition-colors sm:text-[13px] ${
                      active ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}
                  >
                    {dir.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quiet Editorial Footer Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-3 text-[11.5px] font-medium tracking-[0.12em] uppercase text-white/75">
        <span>Tailored Aesthetic Direction</span>
        <span>Built Around Your Identity</span>
      </div>
    </div>
  );
}
