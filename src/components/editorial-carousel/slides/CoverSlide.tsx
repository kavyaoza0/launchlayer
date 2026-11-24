import { useEffect, useRef, useState } from 'react';
import { WebsiteMockup, type MockupDirection } from '../WebsiteMockups';

interface CoverSlideProps {
  isActive: boolean;
  prefersReducedMotion: boolean;
}

const BAND_ITEMS: {
  id: MockupDirection;
  label: string;
  discipline: string;
  craftNote: string;
  standard: string;
}[] = [
  {
    id: 'ecommerce',
    label: 'Commerce',
    discipline: 'Direct-to-Consumer Storefront',
    craftNote: 'Editorial product staging, restrained bags, and distraction-free purchase rhythm',
    standard: 'Conversion Craft',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    discipline: 'Spatial Monograph',
    craftNote: 'Daylight contrast, structured calm, and full-bleed architectural framing',
    standard: 'Spatial Rhythm',
  },
  {
    id: 'fintech',
    label: 'Fintech',
    discipline: 'Product & Treasury UI',
    craftNote: 'Tabular financial clarity and dark surface contrast built for dense workflows',
    standard: 'High-Density Precision',
  },
  {
    id: 'hardware',
    label: 'Hardware',
    discipline: 'Industrial Flagship Launch',
    craftNote: 'Technical specification hierarchy paired with crisp reservation pathways',
    standard: 'Launch Precision',
  },
  {
    id: 'lifestyle',
    label: 'Hospitality',
    discipline: 'Atmosphere & Reservations',
    craftNote: 'Warm sensory typography and curated visual storytelling for cultural spaces',
    standard: 'Brand Presence',
  },
];

export function CoverSlide({
  isActive,
  prefersReducedMotion,
}: CoverSlideProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const speedTargetRef = useRef(1);
  const speedCurrentRef = useRef(1);
  const offsetRef = useRef(0);
  const [selectedDirection, setSelectedDirection] = useState<MockupDirection | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const targetSpeed = selectedDirection ? 0.12 : speedTargetRef.current;
      speedCurrentRef.current += (targetSpeed - speedCurrentRef.current) * 0.08;
      const basePxPerSec = 42;
      offsetRef.current += basePxPerSec * speedCurrentRef.current * dt;

      const el = trackRef.current;
      if (el) {
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth;
        }
        el.style.transform = `translate3d(${-offsetRef.current.toFixed(2)}px, 0, 0)`;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [prefersReducedMotion, selectedDirection]);

  const activeProof = selectedDirection
    ? BAND_ITEMS.find((item) => item.id === selectedDirection) ?? null
    : null;

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-black p-6 font-body text-white sm:p-10 lg:px-14 lg:py-9">
      {/* Soft monochrome ambient studio lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[22%] top-[28%] h-[380px] w-[620px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_72%)] blur-[110px]" />
        <div className="absolute right-[14%] bottom-[22%] h-[420px] w-[720px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_74%)] blur-[115px]" />
      </div>

      {/* Top Metadata + Interactive Discipline Selector (Zero Arrows) */}
      <div className="relative z-20 flex flex-col gap-3 border-b border-white/12 pb-3.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] font-medium tracking-[0.14em] uppercase text-white/50 sm:text-[11px]">
          <span className="whitespace-nowrap">WEB DESIGN &amp; DEVELOPMENT</span>
          <span aria-hidden="true" className="hidden text-white/30 sm:inline">
            ·
          </span>
          <span className="hidden whitespace-nowrap text-white/80 sm:inline">
            INDEPENDENT DIGITAL STUDIO
          </span>
          <span aria-hidden="true" className="hidden text-white/30 md:inline">
            ·
          </span>
          <span className="hidden whitespace-nowrap md:inline">AHMEDABAD · WORLDWIDE</span>
        </div>

        {/* Interactive Showcase Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter visual directions in showcase"
          onPointerDown={(e) => e.stopPropagation()}
          className="flex flex-wrap items-center gap-1.5"
        >
          <button
            type="button"
            role="tab"
            tabIndex={isActive ? 0 : -1}
            aria-selected={selectedDirection === null}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDirection(null);
            }}
            className={`min-h-[34px] rounded-full px-3.5 py-1 font-space-mono text-[10px] tracking-[0.1em] uppercase transition-all duration-150 whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              selectedDirection === null
                ? 'bg-white text-black'
                : 'border border-white/14 bg-white/[0.02] text-white/60 hover:border-white/35 hover:text-white'
            }`}
          >
            All
          </button>
          {BAND_ITEMS.map((item) => {
            const active = selectedDirection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                tabIndex={isActive ? 0 : -1}
                aria-selected={active}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDirection((prev) => (prev === item.id ? null : item.id));
                }}
                className={`min-h-[34px] rounded-full px-3.5 py-1 font-space-mono text-[10px] tracking-[0.1em] uppercase transition-all duration-150 whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  active
                    ? 'bg-white text-black'
                    : 'border border-white/14 bg-white/[0.02] text-white/60 hover:border-white/35 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layered Mid-Stage: Back Typography -> Interactive Moving Preview Band -> Front Typography */}
      <div className="relative my-auto flex flex-1 flex-col justify-center overflow-hidden py-1">
        {/* Back layer typography behind selected previews */}
        <div className="pointer-events-none relative z-[2] select-none">
          <p className="font-heading text-[clamp(3rem,7.2vw,6.35rem)] leading-[0.88] tracking-tight text-white/95">
            A better way
          </p>
        </div>

        {/* Continuous horizontal moving website preview band (clickable frames, zero arrows) */}
        <div
          onMouseEnter={() => {
            speedTargetRef.current = 0.08;
          }}
          onMouseLeave={() => {
            speedTargetRef.current = 1;
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="relative z-10 -my-2.5 flex w-full overflow-hidden py-3 sm:-my-4 sm:py-4"
        >
          <div
            ref={trackRef}
            className="flex shrink-0 items-center gap-4 will-change-transform sm:gap-6 lg:gap-7"
          >
            {[...BAND_ITEMS, ...BAND_ITEMS].map((item, idx) => {
              const selected = selectedDirection === item.id;
              const dimmed = selectedDirection !== null && !selected;
              return (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  tabIndex={isActive && idx < BAND_ITEMS.length ? 0 : -1}
                  aria-label={`Inspect ${item.label} web direction`}
                  aria-pressed={selected}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDirection((prev) => (prev === item.id ? null : item.id));
                  }}
                  className={`h-[155px] w-[225px] shrink-0 overflow-hidden rounded-xl border bg-[#0b0b0b] text-left transition-all duration-300 ease-[cubic-bezier(0.22,0.8,0.2,1)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-[220px] sm:w-[320px] lg:h-[255px] lg:w-[375px] ${
                    selected
                      ? '-translate-y-1.5 border-white/65 shadow-[0_24px_56px_rgba(0,0,0,0.92),0_0_28px_rgba(255,255,255,0.16)]'
                      : dimmed
                      ? 'border-white/10 opacity-45 hover:border-white/35 hover:opacity-85'
                      : 'll-glow-border hover:-translate-y-1 hover:border-white/45 hover:shadow-[0_20px_48px_rgba(0,0,0,0.9)]'
                  }`}
                >
                  <WebsiteMockup direction={item.id} compact />
                </button>
              );
            })}
          </div>
        </div>

        {/* Front layer typography overlapping previews for editorial depth */}
        <div className="pointer-events-none relative z-20 flex flex-col items-end text-right select-none">
          <p className="font-heading text-[clamp(3.15rem,7.5vw,6.65rem)] leading-[0.86] tracking-tight text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.92)]">
            <span className="italic">to be seen</span>.
          </p>
          <p className="mt-2 font-body text-[12px] font-medium tracking-[0.28em] uppercase text-white/75 sm:text-[13.5px]">
            LAUNCHLAYER.
          </p>
        </div>
      </div>

      {/* Bottom Interactive Craft Proof & Studio Standards Bar (Zero Arrows) */}
      <div className="relative z-20 flex flex-col justify-between gap-3 border-t border-white/12 pt-3.5 lg:flex-row lg:items-center">
        <div className="min-w-0">
          {activeProof ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] sm:text-[13.5px]">
              <span className="font-space-mono text-[10.5px] tracking-[0.14em] uppercase text-white/85">
                {activeProof.label} · {activeProof.discipline}
              </span>
              <span aria-hidden="true" className="text-white/35">
                ·
              </span>
              <span className="font-light text-white">{activeProof.craftNote}</span>
              <span aria-hidden="true" className="text-white/35">
                ·
              </span>
              <span className="text-white/70">{activeProof.standard}</span>
            </div>
          ) : (
            <p className="max-w-[58ch] text-[13px] font-light leading-[1.55] text-white/60 sm:text-[14.5px]">
              We design and build digital experiences that give businesses a stronger presence
              online. Select any preview or direction above to inspect our approach.
            </p>
          )}
        </div>

        {/* Clean Unboxed Studio Proof Strip — No Arrows */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-space-mono text-[10px] tracking-[0.12em] uppercase text-white/50 shrink-0">
          <span className="text-white/80">Custom Architecture</span>
          <span aria-hidden="true" className="text-white/30">
            /
          </span>
          <span className="text-white/80">Responsive Craft</span>
          <span aria-hidden="true" className="text-white/30">
            /
          </span>
          <span className="text-white">Sub-Second Performance</span>
        </div>
      </div>
    </div>
  );
}
