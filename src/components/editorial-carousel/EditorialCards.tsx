import { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Globe,
  Headphones,
  Keyboard,
  Search,
  Sparkles,
} from 'lucide-react';
import { WebsiteMockup, type MockupDirection } from './WebsiteMockups';

interface CardInteractiveProps {
  isActive: boolean;
  isVisible?: boolean;
  prefersReducedMotion: boolean;
  onRequestFocus: () => void;
}

const SPRING = { type: 'spring', stiffness: 250, damping: 27, mass: 0.9 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

function AnimatedCheckIcon({ checked, reduced }: { checked: boolean; reduced: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 overflow-visible" fill="none" aria-hidden="true">
      <motion.path
        d="M2.2 6.3 L4.8 8.8 L9.8 3.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{
          pathLength: checked ? 1 : 0,
          opacity: checked ? 1 : 0,
        }}
        transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 01 · Book & Brief — Gliding Glint & Continuous Wave Checklist              */
/* -------------------------------------------------------------------------- */
const BRIEF_ITEMS = [
  'The basics',
  'Your business',
  'Who it’s for',
  'Pages & words',
  'Logo & photos',
  'Look & style',
] as const;

export function Card01Discovery({
  isActive,
  isVisible = true,
  prefersReducedMotion,
  onRequestFocus,
}: CardInteractiveProps) {
  const [waveStep, setWaveStep] = useState(isActive ? 6 : 2);
  const [customChecked, setCustomChecked] = useState<boolean[]>([
    true,
    false,
    true,
    false,
    true,
    false,
  ]);
  const [userInteracted, setUserInteracted] = useState(false);
  const activeAnim = isActive && isVisible && !prefersReducedMotion;

  // Resume smooth auto-cycle 9s after manual toggle so showcase stays alive
  useEffect(() => {
    if (!userInteracted) return;
    const resume = window.setTimeout(() => setUserInteracted(false), 9000);
    return () => window.clearTimeout(resume);
  }, [userInteracted, customChecked]);

  useEffect(() => {
    if (userInteracted) return;
    if (prefersReducedMotion) {
      setWaveStep(BRIEF_ITEMS.length);
      return;
    }
    if (!isVisible || !isActive) return;

    const timer = window.setInterval(() => {
      setWaveStep((prev) => (prev >= BRIEF_ITEMS.length + 2 ? 1 : prev + 1));
    }, 640);

    return () => window.clearInterval(timer);
  }, [isActive, isVisible, prefersReducedMotion, userInteracted]);

  const checkedCount = Math.min(waveStep, BRIEF_ITEMS.length);
  const activeItems = userInteracted
    ? customChecked
    : BRIEF_ITEMS.map((_, idx) => idx < checkedCount);
  const doneCount = activeItems.filter(Boolean).length;
  const focusCursorIdx = !userInteracted && !prefersReducedMotion ? (waveStep - 1) % BRIEF_ITEMS.length : -1;

  const toggleItem = (idx: number) => {
    setUserInteracted(true);
    setCustomChecked((prev) => {
      const base = userInteracted ? prev : BRIEF_ITEMS.map((_, i) => i < checkedCount);
      const next = [...base];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col justify-center gap-2.5 sm:gap-3.5">
      {/* Segmented Intake Progress Meter with Specular Shimmer */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div
          aria-hidden="true"
          className="ll-glass-control relative grid flex-1 grid-cols-6 gap-1.5 overflow-hidden rounded-full border border-white/15 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
          {BRIEF_ITEMS.map((item, idx) => (
            <motion.span
              key={item}
              animate={{
                backgroundColor: activeItems[idx] ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.12)',
                boxShadow: activeItems[idx]
                  ? '0 0 8px rgba(255,255,255,0.35)'
                  : '0 0 0px rgba(0,0,0,0)',
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: EASE }}
              className="block h-1.5 rounded-full"
            />
          ))}

          {activeAnim && (
            <motion.div
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />
          )}
        </div>

        <span
          aria-live="polite"
          className="inline-flex shrink-0 items-center font-space-mono text-[10.5px] font-medium tracking-[0.06em] text-white/90 tabular-nums sm:text-[11px]"
        >
          {doneCount} of {BRIEF_ITEMS.length} covered
        </span>
      </div>

      {/* Interactive Toggle Checklist Grid with Gliding Active Highlight */}
      <LayoutGroup id="card01-brief">
        <div
          role="group"
          aria-label="Discovery brief checklist items"
          className="grid grid-cols-2 gap-2 sm:gap-2.5"
        >
          {BRIEF_ITEMS.map((item, idx) => {
            const checked = activeItems[idx];
            const isGlint = idx === focusCursorIdx;
            return (
              <motion.button
                key={item}
                type="button"
                aria-pressed={checked}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                onFocus={onRequestFocus}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(idx);
                }}
                className={`group relative z-0 flex min-h-[40px] items-center gap-2 overflow-hidden rounded-xl border px-2.5 py-1.5 text-left text-[11px] leading-[1.2] transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] sm:min-h-[42px] sm:gap-2.5 sm:px-3 sm:text-[12.5px] ${
                  checked
                    ? 'border-white/38 bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                    : 'll-glass-control border-white/12 text-white/80 hover:border-white/30 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {isGlint && (
                  <motion.span
                    layoutId="brief-active-glint"
                    transition={SPRING}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-white/16 via-white/8 to-transparent"
                  />
                )}

                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                    checked
                      ? 'border-white bg-white text-black'
                      : 'border-white/28 bg-transparent group-hover:border-white/55'
                  }`}
                >
                  <AnimatedCheckIcon checked={checked} reduced={prefersReducedMotion} />
                </span>
                <span className="font-medium break-words">{item}</span>
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 · Plan & Direction — Levitating Deck + Swatches + Dual-Signal Sitemap   */
/* -------------------------------------------------------------------------- */
const DIRECTION_FAN: {
  id: MockupDirection;
  label: string;
  swatches: [string, string, string];
}[] = [
  { id: 'ecommerce', label: 'Warm Store', swatches: ['#0E1913', '#C47F52', '#F3EDE2'] },
  { id: 'architecture', label: 'Clean Studio', swatches: ['#EFECE6', '#C8BEB0', '#191816'] },
  { id: 'fintech', label: 'Modern Tech', swatches: ['#090C11', '#34D399', '#E8EEF7'] },
];

const SITEMAP_PAGES = [
  { name: 'About', lines: [0.85, 0.65, 0.45] },
  { name: 'Work', lines: [0.9, 0.72, 0.55] },
  { name: 'Pricing', lines: [0.75, 0.55] },
  { name: 'Contact', lines: [0.65, 0.45] },
] as const;

export function Card02Direction({
  isActive,
  isVisible = true,
  prefersReducedMotion,
  onRequestFocus,
}: CardInteractiveProps) {
  const [mode, setMode] = useState<'directions' | 'sitemap'>('directions');
  const [focusedDir, setFocusedDir] = useState(1);
  const [mappedCount, setMappedCount] = useState(2);
  const [pinned, setPinned] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const activeAnim = isActive && isVisible && !prefersReducedMotion;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const resume = window.setTimeout(() => setPinned(false), 9000);
    return () => window.clearTimeout(resume);
  }, [pinned, mode, focusedDir, mappedCount]);

  useEffect(() => {
    if (!activeAnim || pinned) return;

    let tick = 0;
    const timer = window.setInterval(() => {
      tick += 1;
      const phase = tick % 8;
      if (phase < 4) {
        setMode('directions');
        setFocusedDir(phase % DIRECTION_FAN.length);
      } else {
        setMode('sitemap');
        setMappedCount(((phase - 4) % 4) + 1);
      }
    }, 1650);

    return () => window.clearInterval(timer);
  }, [activeAnim, pinned]);

  const activePalette = DIRECTION_FAN[focusedDir].swatches;

  return (
    <div className="flex h-full flex-col justify-between gap-2 py-0.5 sm:gap-2.5">
      {/* Header Row with Sliding Mode Switcher */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <LayoutGroup id="card02-dir">
          <div
            role="tablist"
            aria-label="Inspect planning stage views"
            className="ll-glass-control relative inline-flex items-center rounded-full border border-white/18 p-0.5"
          >
            {(['directions', 'sitemap'] as const).map((tab) => {
              const selected = mode === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onFocus={onRequestFocus}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode(tab);
                    setPinned(true);
                  }}
                  className={`relative z-10 min-h-[32px] rounded-full px-2.5 text-[10.5px] font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-[34px] sm:px-3 sm:text-[11px] ${
                    selected ? 'text-black' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="direction-mode-pill"
                      transition={prefersReducedMotion ? { duration: 0 } : SPRING}
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm"
                    />
                  )}
                  {tab === 'directions' ? 'Pick a style' : 'Page plan'}
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Live Color Swatches or Mapped Count */}
        {mode === 'directions' ? (
          <div aria-hidden="true" className="flex items-center gap-2">
            <div className="flex items-center -space-x-1">
              {activePalette.map((hex, sIdx) => (
                <motion.span
                  key={`${focusedDir}-${hex}`}
                  initial={prefersReducedMotion ? false : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: sIdx * 0.05, duration: 0.25 }}
                  className="h-3.5 w-3.5 rounded-full border border-black/80 ring-1 ring-white/25"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <span className="hidden font-space-mono text-[10.5px] text-white/80 sm:inline">
              {DIRECTION_FAN[focusedDir].label}
            </span>
          </div>
        ) : (
          <span className="font-space-mono text-[10.5px] text-white/75 tabular-nums sm:text-[11px]">
            {mappedCount} of 4 planned
          </span>
        )}
      </div>

      {/* Animated Sandbox Content */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === 'directions' ? (
            <motion.div
              key="directions"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="relative flex h-[118px] w-full items-center justify-center sm:h-[136px]"
            >
              {DIRECTION_FAN.map((item, idx) => {
                const offset = idx - focusedDir;
                const isFront = offset === 0;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    aria-label={`Select ${item.label} visual direction`}
                    aria-pressed={isFront}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    onFocus={onRequestFocus}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocusedDir(idx);
                      setPinned(true);
                    }}
                    animate={{
                      x: offset * (isMobile ? 46 : 66),
                      y: activeAnim && !isMobile
                        ? isFront
                          ? [0, -4, 0]
                          : [Math.abs(offset) * 6, Math.abs(offset) * 6 - 2, Math.abs(offset) * 6]
                        : Math.abs(offset) * 6,
                      rotate: offset * 6,
                      scale: isFront ? 1 : 0.85,
                      opacity: isFront ? 1 : 0.56,
                      zIndex: isFront ? 20 : 10 - Math.abs(offset),
                    }}
                    transition={
                      activeAnim && !isMobile
                        ? {
                            x: SPRING,
                            rotate: SPRING,
                            scale: SPRING,
                            opacity: { duration: 0.25 },
                            y: {
                              duration: 3 + idx * 0.4,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            },
                          }
                        : prefersReducedMotion
                          ? { duration: 0 }
                          : { x: SPRING, rotate: SPRING, scale: SPRING, y: SPRING, opacity: { duration: 0.25 } }
                    }
                    className={`absolute aspect-[16/10] w-[148px] overflow-hidden rounded-xl border text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-[190px] ${
                      isFront
                        ? 'border-white/75 shadow-[0_20px_44px_rgba(0,0,0,0.88),0_0_24px_rgba(255,255,255,0.12)]'
                        : 'border-white/20 hover:border-white/45'
                    }`}
                  >
                    <div aria-hidden="true" className="h-full w-full">
                      <WebsiteMockup direction={item.id} compact />
                    </div>
                    {isFront && (
                      <motion.span
                        initial={prefersReducedMotion ? false : { scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={SPRING}
                        aria-hidden="true"
                        className="absolute left-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-black shadow"
                      >
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="sitemap"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="flex w-full flex-col items-center gap-2.5"
            >
              {/* Clean Root Node */}
              <div className="ll-glass-control inline-flex items-center rounded-xl border border-white/40 px-4 py-1.5 text-[12px] font-medium text-white shadow">
                <span>Home</span>
              </div>

              {/* Animated Dual-Signal SVG Tree Connectors */}
              <svg
                viewBox="0 0 320 20"
                className="h-4 w-[82%] overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M160 0 V9 M28 9 H292 M28 9 V20 M116 9 V20 M204 9 V20 M292 9 V20"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="1.25"
                  initial={prefersReducedMotion ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: EASE }}
                />
                {activeAnim && (
                  <>
                    <motion.path
                      d="M160 0 V9 H292 V20"
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth="1.6"
                      strokeDasharray="16 260"
                      animate={{ strokeDashoffset: [276, 0] }}
                      transition={{ duration: 2.0, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.path
                      d="M160 0 V9 H28 V20"
                      stroke="rgba(255,255,255,0.65)"
                      strokeWidth="1.5"
                      strokeDasharray="14 260"
                      animate={{ strokeDashoffset: [274, 0] }}
                      transition={{ duration: 2.0, repeat: Infinity, ease: 'linear', delay: 0.9 }}
                    />
                  </>
                )}
              </svg>

              {/* 4 Sub-Page Nodes */}
              <div className="grid w-full grid-cols-4 gap-1.5 sm:gap-2">
                {SITEMAP_PAGES.map((page, pIdx) => {
                  const mapped = pIdx < mappedCount;
                  return (
                    <motion.button
                      key={page.name}
                      type="button"
                      aria-pressed={mapped}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                      onFocus={onRequestFocus}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPinned(true);
                        setMappedCount(pIdx + 1);
                      }}
                      className={`flex min-h-[60px] flex-col justify-between rounded-xl border p-1.5 text-left transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-[66px] sm:p-2 ${
                        mapped
                          ? 'border-white/40 bg-white/[0.1] text-white'
                          : 'll-glass-control border-white/12 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <span className="text-[10px] font-medium leading-tight sm:text-[11px]">{page.name}</span>
                      <div aria-hidden="true" className="space-y-1 pt-1">
                        {page.lines.map((w, lIdx) => (
                          <motion.div
                            key={lIdx}
                            animate={{
                              backgroundColor:
                                mapped && lIdx === 0 ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.22)',
                              scaleX: mapped ? 1 : 0.72,
                            }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="h-1 origin-left rounded-full"
                            style={{ width: `${Math.round(w * 100)}%` }}
                          />
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 03 · Design & Build — Repeating Morph + Automated Studio Cursor Study      */
/* -------------------------------------------------------------------------- */
const BUILD_VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', width: '1440px', widthPct: '100%' },
  { id: 'tablet', label: 'Tablet', width: '834px', widthPct: '68%' },
  { id: 'mobile', label: 'Mobile', width: '390px', widthPct: '38%' },
] as const;

export function Card03DesignBuild({
  isActive,
  isVisible = true,
  prefersReducedMotion,
  onRequestFocus,
}: CardInteractiveProps) {
  const [vpIdx, setVpIdx] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeAnim = isActive && isVisible && !prefersReducedMotion;

  useEffect(() => {
    if (!pinned) return;
    const resume = window.setTimeout(() => setPinned(false), 9000);
    return () => window.clearTimeout(resume);
  }, [pinned, vpIdx]);

  useEffect(() => {
    if (!activeAnim || pinned) return;
    const timer = window.setInterval(() => {
      setVpIdx((prev) => (prev + 1) % BUILD_VIEWPORTS.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [activeAnim, pinned]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  const currentVp = BUILD_VIEWPORTS[vpIdx];

  const handleCopy = () => {
    const url = 'https://kanso.tesselo.in';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
  };

  return (
    <div className="flex h-full flex-col justify-between gap-2 py-0.5 sm:gap-2.5">
      {/* Header + Animated Segmented Device Switcher */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center font-space-mono text-[10.5px] text-white/85 sm:text-[11px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentVp.width}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -3 }}
              transition={{ duration: 0.18 }}
              className="tabular-nums"
            >
              {currentVp.width}
            </motion.span>
          </AnimatePresence>
        </div>

        <LayoutGroup id="card03-vp">
          <div
            role="tablist"
            aria-label="Preview responsive device layout"
            className="ll-glass-control relative inline-flex items-center rounded-full border border-white/18 p-0.5"
          >
            {BUILD_VIEWPORTS.map((vp, idx) => {
              const active = vpIdx === idx;
              return (
                <button
                  key={vp.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onFocus={onRequestFocus}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setVpIdx(idx);
                    setPinned(true);
                  }}
                  className={`relative z-10 min-h-[32px] rounded-full px-2 text-[10.5px] font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-[34px] sm:px-3 sm:text-[11px] ${
                    active ? 'text-black' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="build-vp-pill"
                      transition={prefersReducedMotion ? { duration: 0 } : SPRING}
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm"
                    />
                  )}
                  {vp.label}
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      {/* Morphing Responsive Browser Window + Live Kinetic Cursor Study */}
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: currentVp.widthPct }}
          transition={prefersReducedMotion ? { duration: 0 } : SPRING}
          className="relative flex h-[92px] flex-col overflow-hidden rounded-xl border border-white/24 bg-black shadow-[0_16px_38px_rgba(0,0,0,0.9)] sm:h-[108px]"
        >
          <div
            aria-hidden="true"
            className="flex h-4 shrink-0 items-center justify-between border-b border-white/10 bg-[#121216] px-2.5"
          >
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>
            <span className="font-space-mono text-[8px] uppercase tracking-[0.12em] text-white/50">
              {currentVp.label}
            </span>
          </div>

          <div aria-hidden="true" className="relative flex-1 overflow-hidden">
            <WebsiteMockup direction="architecture" compact />

            {/* Continuous glass specular sweep */}
            {activeAnim && (
              <motion.div
                animate={{ x: ['-120%', '240%'] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: EASE, repeatDelay: 0.8 }}
                className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/16 to-transparent"
              />
            )}

            {/* Animated Studio Inspection Cursor */}
            {activeAnim && (
              <motion.div
                animate={{
                  left: ['18%', '68%', '46%', '18%'],
                  top: ['26%', '44%', '74%', '26%'],
                }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute z-20 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
              >
                <svg viewBox="0 0 18 18" className="h-3.5 w-3.5" fill="none">
                  <path
                    d="M2.5 2 L14.5 7.5 L8.8 9.4 L6.8 14.8 Z"
                    fill="#FFFFFF"
                    stroke="#0A0A0D"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Interactive Staging URL Bar */}
      <div className="ll-glass-control flex items-center justify-between gap-2 rounded-xl border border-white/15 px-3 py-1.5">
        <span className="truncate font-space-mono text-[11px] text-white/75">
          kanso.tesselo.in
        </span>
        <motion.button
          type="button"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
          onFocus={onRequestFocus}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-white" aria-hidden="true" />
              <span className="text-white">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" aria-hidden="true" />
              <span>Copy link</span>
            </>
          )}
        </motion.button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Staging link copied to clipboard' : ''}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 · Accessibility & Launch — SVG Gauge + Gliding Focus Ring Simulation    */
/* -------------------------------------------------------------------------- */
const LAUNCH_CHECKS = [
  { id: 'wcag', label: 'Easy-to-read text', metric: 'WCAG AA contrast', icon: Keyboard },
  { id: 'seo', label: 'Ready for Google', metric: 'Search basics set', icon: Search },
  { id: 'domain', label: 'Domain & security', metric: 'HTTPS active', icon: Globe },
  { id: 'care', label: '15-day support', metric: 'Direct help', icon: Headphones },
] as const;

export function Card04AccessibilityLaunch({
  isActive,
  isVisible = true,
  prefersReducedMotion,
  onRequestFocus,
}: CardInteractiveProps) {
  const [waveStep, setWaveStep] = useState(isActive ? 4 : 2);
  const [customState, setCustomState] = useState<boolean[]>([true, true, false, false]);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (!userInteracted) return;
    const resume = window.setTimeout(() => setUserInteracted(false), 9000);
    return () => window.clearTimeout(resume);
  }, [userInteracted, customState]);

  useEffect(() => {
    if (userInteracted) return;
    if (prefersReducedMotion) {
      setWaveStep(LAUNCH_CHECKS.length);
      return;
    }
    if (!isVisible || !isActive) return;

    const timer = window.setInterval(() => {
      setWaveStep((prev) => (prev >= LAUNCH_CHECKS.length + 2 ? 1 : prev + 1));
    }, 760);

    return () => window.clearInterval(timer);
  }, [isActive, isVisible, prefersReducedMotion, userInteracted]);

  const verifiedCount = Math.min(waveStep, LAUNCH_CHECKS.length);
  const states = userInteracted
    ? customState
    : LAUNCH_CHECKS.map((_, idx) => idx < verifiedCount);
  const totalVerified = states.filter(Boolean).length;
  const ringProgress = totalVerified / LAUNCH_CHECKS.length;
  const focusRingIdx = !userInteracted && !prefersReducedMotion ? (waveStep - 1) % LAUNCH_CHECKS.length : -1;

  const toggleAudit = (idx: number) => {
    setUserInteracted(true);
    setCustomState((prev) => {
      const base = userInteracted ? prev : LAUNCH_CHECKS.map((_, i) => i < verifiedCount);
      const next = [...base];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col justify-center gap-2.5 sm:gap-3.5">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          {/* Animated SVG Radial Completion Ring */}
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 -rotate-90" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="2.5"
            />
            <motion.circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="56.55"
              animate={{ strokeDashoffset: 56.55 * (1 - ringProgress) }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
            />
          </svg>
          <span className="font-space-mono text-[10.5px] text-white/85 sm:text-[11px]">
            Launch checklist
          </span>
        </div>

        <span
          aria-live="polite"
          className="inline-flex shrink-0 items-center font-space-mono text-[10.5px] font-medium tracking-[0.04em] text-white/90 tabular-nums sm:text-[11px]"
        >
          {totalVerified} of {LAUNCH_CHECKS.length} checked
        </span>
      </div>

      {/* 2x2 Audit Grid with Gliding Keyboard-Focus Simulation */}
      <LayoutGroup id="card04-wcag">
        <div
          role="group"
          aria-label="Accessibility and launch readiness checks"
          className="grid grid-cols-2 gap-2 sm:gap-2.5"
        >
          {LAUNCH_CHECKS.map((check, idx) => {
            const Icon = check.icon;
            const passed = states[idx];
            const isFocusSim = idx === focusRingIdx;
            return (
              <motion.button
                key={check.id}
                type="button"
                aria-pressed={passed}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                onFocus={onRequestFocus}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAudit(idx);
                }}
                className={`relative z-0 flex min-h-[46px] items-center justify-between gap-1.5 rounded-xl border px-2.5 py-1.5 text-left text-[11px] leading-[1.2] transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] sm:min-h-[50px] sm:gap-2.5 sm:px-3 sm:py-2 sm:text-[12px] ${
                  passed
                    ? 'border-white/38 bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                    : 'll-glass-control border-white/12 text-white/80 hover:border-white/30 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {isFocusSim && (
                  <motion.span
                    layoutId="wcag-focus-glint"
                    transition={SPRING}
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-[2px] -z-10 rounded-[14px] border border-white/75 shadow-[0_0_16px_rgba(255,255,255,0.16)]"
                  />
                )}

                <span className="flex min-w-0 items-start gap-1.5 sm:items-center sm:gap-2">
                  <Icon
                    aria-hidden="true"
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors sm:mt-0 ${
                      passed ? 'text-white' : 'text-white/60'
                    }`}
                  />
                  <span className="min-w-0">
                    <span className="block font-medium leading-[1.2]">{check.label}</span>
                    <span className="mt-0.5 block font-space-mono text-[9px] uppercase tracking-[0.05em] text-white/60 sm:text-[9.5px]">
                      {check.metric}
                    </span>
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    passed
                      ? 'border-white bg-white text-black'
                      : 'border-white/30 bg-transparent'
                  }`}
                >
                  <AnimatedCheckIcon checked={passed} reduced={prefersReducedMotion} />
                </span>
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 05 · Work & Investment — Continuous Spotlight + Metallic CTA Sweep         */
/* -------------------------------------------------------------------------- */
const SCOPE_OPTIONS = [
  { id: 'starter', name: 'Starter', rate: '$249', timeline: '1–2 weeks', note: 'One clear, focused page' },
  { id: 'business', name: 'Business', rate: '$599', timeline: '2–3 weeks', note: 'Up to 5 custom pages' },
  { id: 'signature', name: 'Signature', rate: '$1,199', timeline: '3–5 weeks', note: 'Custom animations & style' },
  { id: 'bespoke', name: 'Bespoke', rate: '$2,000+', timeline: 'Custom timeline', note: 'Online stores & custom builds' },
] as const;

export function Card05Investment({
  isActive,
  isVisible = true,
  prefersReducedMotion,
  onRequestFocus,
  onSelectPricing,
}: CardInteractiveProps & { onSelectPricing: (tierId: string) => void }) {
  const [selectedTier, setSelectedTier] = useState(2);
  const [pinned, setPinned] = useState(false);
  const activeAnim = isActive && isVisible && !prefersReducedMotion;

  useEffect(() => {
    if (!pinned) return;
    const resume = window.setTimeout(() => setPinned(false), 9000);
    return () => window.clearTimeout(resume);
  }, [pinned, selectedTier]);

  useEffect(() => {
    if (!activeAnim || pinned) return;
    const timer = window.setInterval(() => {
      setSelectedTier((prev) => (prev + 1) % SCOPE_OPTIONS.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [activeAnim, pinned]);

  const current = SCOPE_OPTIONS[selectedTier];

  return (
    <div className="flex h-full flex-col justify-center gap-2.5 sm:justify-between sm:gap-2.5">
      <LayoutGroup id="card05-scope">
        <div
          role="radiogroup"
          aria-label="Choose a website option"
          className="grid grid-cols-2 gap-2"
        >
          {SCOPE_OPTIONS.map((tier, idx) => {
            const active = selectedTier === idx;
            return (
              <motion.button
                key={tier.id}
                type="button"
                role="radio"
                aria-checked={active}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                onFocus={onRequestFocus}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTier(idx);
                  setPinned(true);
                }}
                className={`relative z-0 flex min-h-[44px] items-baseline justify-between gap-1.5 overflow-hidden rounded-xl border px-2.5 py-1.5 text-left transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-[48px] sm:gap-2 sm:px-3 sm:py-2 ${
                  active
                    ? 'border-white/55 text-white shadow-[0_0_18px_rgba(255,255,255,0.08)]'
                    : 'll-glass-control border-white/12 text-white/80 hover:border-white/30 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="investment-tier-highlight"
                    transition={prefersReducedMotion ? { duration: 0 } : SPRING}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-white/[0.11]"
                  />
                )}
                <span className="text-[11.5px] font-medium leading-tight sm:text-[12.5px]">{tier.name}</span>
                <span className={`shrink-0 font-space-mono text-[10.5px] tabular-nums sm:text-[11px] ${active ? 'text-white' : 'text-white/70'}`}>
                  {tier.rate}
                </span>
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="ll-glass-control flex items-center justify-between gap-2.5 rounded-xl border border-white/15 px-3 py-2 sm:gap-3 sm:px-3.5 sm:py-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="min-w-0 flex-1"
          >
            <div className="flex items-center gap-1.5 text-[10.5px] font-space-mono uppercase tracking-[0.08em] text-white/85 sm:text-[11px]">
              <motion.span
                animate={activeAnim ? { rotate: [0, 14, -14, 0] } : { rotate: 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex shrink-0"
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
              </motion.span>
              <span>{current.timeline}</span>
            </div>
            <p className="text-[11px] leading-[1.3] text-white/85 sm:text-[12.5px]">{current.note}</p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          type="button"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          onFocus={onRequestFocus}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPricing(current.id);
          }}
          className="group relative inline-flex min-h-[38px] shrink-0 items-center gap-1 overflow-hidden rounded-full bg-white px-3 py-1.5 text-[11.5px] font-medium text-black transition-colors hover:bg-white/90 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:min-h-[40px] sm:gap-1.5 sm:px-4 sm:text-[12.5px]"
        >
          {activeAnim && (
            <motion.span
              animate={{ x: ['-140%', '240%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: EASE, repeatDelay: 1.2 }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-black/15 to-transparent"
            />
          )}
          <span className="relative z-10">Choose {current.name}</span>
          <ArrowUpRight
            className="relative z-10 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </motion.button>
      </div>
    </div>
  );
}
