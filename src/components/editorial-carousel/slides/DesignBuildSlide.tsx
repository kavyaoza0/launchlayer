import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface DesignBuildSlideProps {
  isActive: boolean;
  prefersReducedMotion?: boolean;
}

type DesignLayer = 'wireframe' | 'editorial' | 'polished';
type BuildViewport = 'desktop' | 'tablet' | 'mobile';

const DESIGN_LAYERS: { id: DesignLayer; label: string; note: string }[] = [
  { id: 'wireframe', label: 'Structure', note: 'Spatial proportion & 12-column rhythm' },
  { id: 'editorial', label: 'Typography', note: 'Editorial serif hierarchy & contrast' },
  { id: 'polished', label: 'Composition', note: 'Curated imagery & tactile balance' },
];

const VIEWPORT_SPECS: {
  id: BuildViewport;
  label: string;
  widthLabel: string;
  cols: number;
  frameWidthClass: string;
}[] = [
  { id: 'desktop', label: 'Desktop', widthLabel: '1440px', cols: 3, frameWidthClass: 'w-full' },
  { id: 'tablet', label: 'Tablet', widthLabel: '834px', cols: 2, frameWidthClass: 'w-[72%]' },
  { id: 'mobile', label: 'Mobile', widthLabel: '390px', cols: 1, frameWidthClass: 'w-[44%]' },
];

export function DesignBuildSlide({
  isActive,
  prefersReducedMotion = false,
}: DesignBuildSlideProps) {
  const [designLayerIdx, setDesignLayerIdx] = useState(2);
  const [viewportIdx, setViewportIdx] = useState(0);
  const [isDesignPinned, setIsDesignPinned] = useState(false);
  const [isBuildPinned, setIsBuildPinned] = useState(false);

  // Smoothly cycle through Design layers & Responsive Breakpoints when active
  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;

    const designTimer = isDesignPinned
      ? undefined
      : window.setInterval(() => {
          setDesignLayerIdx((prev) => (prev + 1) % DESIGN_LAYERS.length);
        }, 2600);

    const buildTimer = isBuildPinned
      ? undefined
      : window.setInterval(() => {
          setViewportIdx((prev) => (prev + 1) % VIEWPORT_SPECS.length);
        }, 2400);

    return () => {
      if (designTimer) window.clearInterval(designTimer);
      if (buildTimer) window.clearInterval(buildTimer);
    };
  }, [isActive, prefersReducedMotion, isDesignPinned, isBuildPinned]);

  const currentLayer = DESIGN_LAYERS[designLayerIdx];
  const currentViewport = VIEWPORT_SPECS[viewportIdx];

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black px-5 py-4 font-body text-white sm:px-8 sm:py-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Subtle monochrome studio spotlight */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[440px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_72%)] blur-[108px]" />
      </div>

      {/* Top Editorial Masthead */}
      <div className="relative z-10 flex flex-col gap-3 border-b border-white/15 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
          <span className="text-white">03 · Design &amp; Build</span>
          <span>Concept to Production</span>
        </div>

        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl font-heading text-[clamp(2.1rem,min(4.2vw,6.4dvh),4rem)] font-normal leading-[0.94] tracking-tight text-white [text-wrap:balance]"
          >
            From an idea to something <span className="italic">tangible</span>.
          </motion.h2>
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[46ch] text-[14px] font-normal leading-[1.6] text-white/80"
          >
            With the direction clear, raw sketches evolve layer by layer into sculptural typography,
            fluid layouts, and fast production code.
          </motion.p>
        </div>
      </div>

      {/* Balanced 50/50 Kinetic Split */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="relative z-10 my-auto grid flex-1 grid-cols-1 items-stretch divide-y divide-white/15 py-4 sm:py-6 lg:grid-cols-2 lg:divide-x lg:divide-y-0"
      >
        {/* Left: Interactive Layer Evolution (Structure -> Typography -> Composition) */}
        <div className="flex flex-col justify-between gap-4 pb-6 lg:pr-10 lg:pb-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-space-mono text-[11px] tracking-[0.16em] uppercase text-white/70">
                01 · Art Direction
              </span>
              <h3 className="mt-1 font-heading text-[1.85rem] font-normal leading-none tracking-tight text-white sm:text-[2.15rem]">
                Idea Into Form
              </h3>
            </div>

            {/* Interactive Stage Stepper */}
            <div
              role="group"
              aria-label="Inspect design layer progression"
              className="flex items-center gap-1 border-b border-white/15"
            >
              {DESIGN_LAYERS.map((layer, idx) => {
                const active = designLayerIdx === idx;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    tabIndex={isActive ? 0 : -1}
                    aria-pressed={active}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDesignLayerIdx(idx);
                      setIsDesignPinned(true);
                    }}
                    className={`relative min-h-[44px] px-2.5 text-[11.5px] font-medium tracking-[0.06em] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      active ? 'text-white' : 'text-white/60 hover:text-white/90'
                    }`}
                  >
                    <span>{layer.label}</span>
                    {active && (
                      <motion.span
                        layoutId="design-layer-underline"
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="absolute inset-x-1 -bottom-px h-[1.5px] bg-white"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentLayer.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-[13.5px] font-normal text-white/80"
            >
              {currentLayer.note}
            </motion.p>
          </AnimatePresence>

          {/* Animated Art Direction Canvas */}
          <div
            aria-hidden="true"
            className="relative grid h-44 grid-cols-12 items-stretch overflow-hidden rounded-xl border border-white/18 bg-[#0b0b0b] sm:h-48"
          >
            {/* Animated Hairline Grid Overlay (strongest in Structure phase, settles subtly in Composition) */}
            <motion.div
              animate={{
                opacity: currentLayer.id === 'wireframe' ? 0.85 : currentLayer.id === 'editorial' ? 0.35 : 0.14,
              }}
              transition={{ duration: 0.45 }}
              className="pointer-events-none absolute inset-0 z-10 grid grid-cols-6"
            >
              <div className="border-r border-dashed border-white/25" />
              <div className="border-r border-dashed border-white/25" />
              <div className="border-r border-dashed border-white/25" />
              <div className="border-r border-dashed border-white/25" />
              <div className="border-r border-dashed border-white/25" />
              <div />
            </motion.div>

            {/* Left Typographic Composition */}
            <div className="relative z-20 col-span-7 flex flex-col justify-between p-4 sm:p-5">
              <span className="font-space-mono text-[10.5px] tracking-[0.14em] uppercase text-white/65">
                {currentLayer.label} · 12-Col Grid
              </span>

              <div className="relative my-auto py-2">
                <motion.p
                  animate={{
                    opacity: currentLayer.id === 'wireframe' ? 0.28 : 1,
                    letterSpacing: currentLayer.id === 'wireframe' ? '0.02em' : '-0.02em',
                    y: currentLayer.id === 'wireframe' ? 4 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heading text-[1.6rem] leading-[0.95] text-white sm:text-[1.95rem]"
                >
                  Quiet <span className="italic">craft</span> &amp; spatial rhythm
                </motion.p>
                <motion.div
                  animate={{
                    scaleX: currentLayer.id === 'wireframe' ? 0.4 : 1,
                    opacity: currentLayer.id === 'wireframe' ? 0.35 : 0.7,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-3 h-px w-24 origin-left bg-white/70"
                />
              </div>

              <div className="flex items-center gap-2 font-space-mono text-[10.5px] tracking-[0.12em] uppercase text-white/70">
                <span className="h-2.5 w-2.5 border border-white/50 bg-black" />
                <span className="h-2.5 w-2.5 bg-white" />
                <span className="h-2.5 w-2.5 bg-white/45" />
                <span className="ml-auto">Tokens</span>
              </div>
            </div>

            {/* Right Architectural Image Frame Sliding/Unveiling */}
            <div className="relative col-span-5 overflow-hidden border-l border-white/15 bg-[#121212]">
              <motion.div
                animate={{
                  clipPath:
                    currentLayer.id === 'wireframe'
                      ? 'inset(100% 0% 0% 0%)'
                      : currentLayer.id === 'editorial'
                      ? 'inset(28% 0% 0% 0%)'
                      : 'inset(0% 0% 0% 0%)',
                  opacity: currentLayer.id === 'wireframe' ? 0.15 : 1,
                  scale: currentLayer.id === 'polished' ? 1 : 1.06,
                }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full"
              >
                <img
                  src="/src/assets/images/project_kanso_architecture_1795538724169.jpg"
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-90"
                />
              </motion.div>

              {/* Wireframe Cross Diagonal shown cleanly before photo finishes unveiling */}
              <motion.svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                animate={{ opacity: currentLayer.id === 'wireframe' ? 0.45 : 0 }}
                transition={{ duration: 0.35 }}
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
              </motion.svg>
            </div>
          </div>
        </div>

        {/* Right: Animated Fluid Viewport & Motion Curve Specimen */}
        <div className="flex flex-col justify-between gap-4 pt-6 lg:pl-10 lg:pt-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-space-mono text-[11px] tracking-[0.16em] uppercase text-white/70">
                02 · Production Code
              </span>
              <h3 className="mt-1 font-heading text-[1.85rem] font-normal leading-none tracking-tight text-white sm:text-[2.15rem]">
                Fluid Engineering
              </h3>
            </div>

            {/* Interactive Responsive Breakpoint Switcher */}
            <div
              role="group"
              aria-label="Inspect responsive layout adaptation"
              className="flex items-center gap-1 border-b border-white/15"
            >
              {VIEWPORT_SPECS.map((vp, idx) => {
                const active = viewportIdx === idx;
                return (
                  <button
                    key={vp.id}
                    type="button"
                    tabIndex={isActive ? 0 : -1}
                    aria-pressed={active}
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewportIdx(idx);
                      setIsBuildPinned(true);
                    }}
                    className={`relative min-h-[44px] px-2.5 text-[11.5px] font-medium tracking-[0.06em] uppercase transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      active ? 'text-white' : 'text-white/60 hover:text-white/90'
                    }`}
                  >
                    <span>{vp.label}</span>
                    {active && (
                      <motion.span
                        layoutId="build-viewport-underline"
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="absolute inset-x-1 -bottom-px h-[1.5px] bg-white"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[13.5px] font-normal text-white/80">
            Fluid layout architecture adapting effortlessly across{' '}
            <span className="font-space-mono text-white tabular-nums">
              {currentViewport.widthLabel}
            </span>{' '}
            viewports at <span className="font-space-mono text-white">60 fps</span>.
          </p>

          {/* Animated Morphing Responsive Viewport Container */}
          <div
            aria-hidden="true"
            className="relative flex h-44 flex-col justify-between overflow-hidden rounded-xl border border-white/18 bg-[#080808] p-4 sm:h-48 sm:p-5"
          >
            <div className="flex items-center justify-between font-space-mono text-[10.5px] tracking-[0.12em] uppercase text-white/70">
              <span>Viewport · {currentViewport.label}</span>
              <span className="tabular-nums text-white">{currentViewport.widthLabel}</span>
            </div>

            {/* Physically Morphing Layout Frame */}
            <div className="my-auto flex w-full justify-center py-2">
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 210, damping: 26 }}
                className={`${currentViewport.frameWidthClass} overflow-hidden rounded-lg border border-white/25 bg-white/[0.04] p-2.5`}
              >
                <div
                  className={`grid gap-2 ${
                    currentViewport.cols === 3
                      ? 'grid-cols-3'
                      : currentViewport.cols === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 210, damping: 26 }}
                    className="h-9 rounded-sm bg-white/85 p-1.5"
                  >
                    <div className="h-1 w-8 bg-black/75" />
                    <div className="mt-1.5 h-1 w-12 bg-black/30" />
                  </motion.div>
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 210, damping: 26 }}
                    className="h-9 rounded-sm border border-white/20 bg-white/10 p-1.5"
                  >
                    <div className="h-1 w-7 bg-white/70" />
                    <div className="mt-1.5 h-1 w-10 bg-white/30" />
                  </motion.div>
                  {currentViewport.cols === 3 && (
                    <motion.div
                      layout
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className="h-9 rounded-sm border border-white/20 bg-white/10 p-1.5"
                    >
                      <div className="h-1 w-6 bg-white/70" />
                      <div className="mt-1.5 h-1 w-9 bg-white/30" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Live Studio Motion Easing Curve */}
            <div className="flex items-center justify-between gap-4 border-t border-white/12 pt-2 font-space-mono text-[10.5px] uppercase tracking-[0.12em] text-white/70">
              <span>cubic-bezier(0.16, 1, 0.3, 1)</span>
              <svg viewBox="0 0 64 16" className="h-3.5 w-14 shrink-0 overflow-visible" fill="none">
                <path d="M2 14 C 14 14, 18 2, 62 2" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
                <motion.path
                  key={`${viewportIdx}-${isActive}`}
                  d="M2 14 C 14 14, 18 2, 62 2"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={prefersReducedMotion ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quiet Editorial Footer Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-3 text-[11.5px] font-medium tracking-[0.12em] uppercase text-white/75">
        <span>Visual Systems &amp; Production Code</span>
        <span>Cross-Device Craft</span>
      </div>
    </div>
  );
}
