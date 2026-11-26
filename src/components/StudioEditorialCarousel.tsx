import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useScrollToTraverse } from '../hooks/useScrollToTraverse';
import type { EnquiryTopic } from './Navbar';
import {
  Card01Discovery,
  Card02Direction,
  Card03DesignBuild,
  Card04AccessibilityLaunch,
  Card05Investment,
} from './editorial-carousel/EditorialCards';

interface StudioEditorialCarouselProps {
  onOpenEnquiry: (topic?: EnquiryTopic, tierId?: string) => void;
  requestedSlide?: { index: number; nonce: number } | null;
}

const STAGES = [
  {
    num: '01',
    badge: 'DAY 1',
    title: 'Book & Brief',
    description:
      'Reserve your build window and share your goals, target audience, visual feel, and core pages.',
  },
  {
    num: '02',
    badge: '2 TO 5 DAYS',
    title: 'Plan & Direction',
    description:
      'We map the sitemap, craft focused copy, and present bespoke visual directions around your brand.',
  },
  {
    num: '03',
    badge: '1 TO 3 WEEKS',
    title: 'Design & Build',
    description:
      'Sculptural typography, fluid motion, and production code built responsively across every device.',
  },
  {
    num: '04',
    badge: '1 TO 2 DAYS',
    title: 'Accessibility & Launch',
    description:
      'We verify contrast, keyboard flow, and performance before connecting your domain and staying on for 15 days.',
  },
  {
    num: '05',
    badge: 'FIXED SCOPE',
    title: 'Work & Investment',
    description:
      'Transparent one-time starting rates with defined timelines, from single-page launches to custom systems.',
  },
] as const;

const TOTAL_STAGES = STAGES.length;
const EASE = [0.16, 1, 0.3, 1] as const;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function StudioEditorialCarousel({
  onOpenEnquiry,
  requestedSlide,
}: StudioEditorialCarouselProps) {
  const headerInnerRef = useRef<HTMLDivElement | null>(null);
  const localTrackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const rimRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const metricsRef = useRef({ contentLeft: 0, maxTravel: 0 });
  const prefersReducedMotionRef = useRef(false);

  // Pure compositor frame updates with zero synchronous layout reads (getComputedStyle cached via ResizeObserver)
  const handleTrackProgress = useCallback((progress: number) => {
    const track = localTrackRef.current;
    if (!track) return;

    const { contentLeft, maxTravel } = metricsRef.current;
    const t = progress / Math.max(TOTAL_STAGES - 1, 1);
    const tx = contentLeft - t * maxTravel;
    track.style.transform = `translate3d(${tx.toFixed(2)}px, 0, 0)`;

    const reduced = prefersReducedMotionRef.current;
    for (let i = 0; i < TOTAL_STAGES; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;

      const dist = i - progress;
      const focus = clamp(1 - Math.abs(dist), 0, 1);
      // Smoothstep easing for continuous velvety card focus entrance & exit
      const smoothFocus = focus * focus * (3 - 2 * focus);

      if (reduced) {
        card.style.transform = 'none';
        card.style.opacity = '1';
      } else {
        const scale = 0.945 + 0.055 * smoothFocus;
        const rotateY = clamp(dist * -4.2, -5.5, 5.5);
        const opacity = 0.44 + 0.56 * smoothFocus;
        card.style.transform = `scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1) rotateY(${rotateY.toFixed(2)}deg)`;
        card.style.opacity = opacity.toFixed(3);
      }

      const rim = rimRefs.current[i];
      if (rim) {
        rim.style.opacity = smoothFocus.toFixed(3);
      }
    }
  }, []);

  const {
    sectionRef,
    trackRef,
    progressBarRef,
    currentProgressRef,
    activeSlide,
    prefersReducedMotion,
    announceMode,
    scrollToSlide,
    setDragging,
  } = useScrollToTraverse({
    totalSlides: TOTAL_STAGES,
    onProgress: handleTrackProgress,
  });

  prefersReducedMotionRef.current = prefersReducedMotion;

  // Measure header/track bounds only on mount & resize so animation frames never trigger reflow
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const header = headerInnerRef.current;
      if (!track || !header) return;

      const headerRect = header.getBoundingClientRect();
      const styles = window.getComputedStyle(header);
      const padLeft = parseFloat(styles.paddingLeft) || 0;
      const padRight = parseFloat(styles.paddingRight) || 0;
      const contentWidth = Math.max(1, headerRect.width - padLeft - padRight);

      metricsRef.current = {
        contentLeft: headerRect.left + padLeft,
        maxTravel: Math.max(0, track.scrollWidth - contentWidth),
      };

      handleTrackProgress(currentProgressRef.current);
    };

    measure();
    window.addEventListener('resize', measure, { passive: true });
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null;
    if (ro && headerInnerRef.current) ro.observe(headerInnerRef.current);
    if (ro && trackRef.current) ro.observe(trackRef.current);

    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [currentProgressRef, handleTrackProgress, trackRef]);

  // Drag + inertial flick state
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    velocityPxPerMs: 0,
    lockedAxis: null as 'x' | 'y' | null,
    inertiaRaf: 0,
  });

  useEffect(() => {
    if (!requestedSlide) return;
    const clamped = clamp(requestedSlide.index, 0, TOTAL_STAGES - 1);
    scrollToSlide(clamped);
  }, [requestedSlide, scrollToSlide]);

  const stopInertia = useCallback(() => {
    if (dragRef.current.inertiaRaf) {
      window.cancelAnimationFrame(dragRef.current.inertiaRaf);
      dragRef.current.inertiaRaf = 0;
    }
  }, []);

  // Global drag tracking so horizontal dragging stays silky even if cursor leaves track bounds
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;

      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      if (!d.lockedAxis) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        d.lockedAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        if (d.lockedAxis === 'y') {
          d.active = false;
          setDragging(false);
          return;
        }
      }

      const now = performance.now();
      const dt = Math.max(1, now - d.lastTime);
      const stepDx = e.clientX - d.lastX;
      d.velocityPxPerMs = d.velocityPxPerMs * 0.55 + (stepDx / dt) * 0.45;
      d.lastX = e.clientX;
      d.lastTime = now;

      window.scrollBy({ top: -stepDx * 1.4, behavior: 'auto' });
    };

    const finishDrag = () => {
      const d = dragRef.current;
      if (!d.active) return;
      d.active = false;
      setDragging(false);

      // Gentle inertial release glide when user flicks horizontally
      let v = clamp(d.velocityPxPerMs * 18, -36, 36);
      if (Math.abs(v) > 1.2 && d.lockedAxis === 'x' && !prefersReducedMotionRef.current) {
        const glide = () => {
          v *= 0.91;
          if (Math.abs(v) < 0.35) {
            d.inertiaRaf = 0;
            return;
          }
          window.scrollBy({ top: -v, behavior: 'auto' });
          d.inertiaRaf = window.requestAnimationFrame(glide);
        };
        stopInertia();
        d.inertiaRaf = window.requestAnimationFrame(glide);
      }
      d.lockedAxis = null;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', finishDrag, { passive: true });
    window.addEventListener('pointercancel', finishDrag, { passive: true });

    return () => {
      stopInertia();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  }, [setDragging, stopInertia]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (activeSlide < TOTAL_STAGES - 1) scrollToSlide(activeSlide + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (activeSlide > 0) scrollToSlide(activeSlide - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSlide(TOTAL_STAGES - 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    stopInertia();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocityPxPerMs: 0,
      lockedAxis: null,
      inertiaRaf: 0,
    };
    setDragging(true);
  };

  const handleCardSpotlightMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="presentation"
      ref={sectionRef}
      role="region"
      aria-roledescription="carousel"
      aria-labelledby="better-seen-heading"
      className="ll-section-seam relative w-full bg-black font-body text-white"
      style={{ height: '340dvh' }}
    >
      {/* Screen-reader live region */}
      <div className="sr-only" aria-live={announceMode} aria-atomic="true">
        Stage {activeSlide + 1} of {TOTAL_STAGES}: {STAGES[activeSlide].title} —{' '}
        {STAGES[activeSlide].description}
      </div>

      {/* Spacious Full-Viewport Sticky Showcase */}
      <div className="sticky top-0 flex min-h-dvh w-full flex-col justify-between overflow-x-clip bg-black">
        {/* Lightweight Pre-Feathered Ambient Spotlight & Subtle Rotating Blueprint Arcs (zero blur-filter raster stalls) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={
              prefersReducedMotion
                ? { opacity: 0.75, scale: 1 }
                : { opacity: [0.55, 0.95, 0.55], scale: [0.96, 1.05, 0.96] }
            }
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-[12%] h-[560px] w-[1160px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(100,206,251,0.085)_0%,rgba(100,206,251,0.025)_42%,transparent_72%)] will-change-transform"
          />

          {/* Subtle Slow-Rotating Studio Geometric Horizon Ring */}
          {!prefersReducedMotion && (
            <motion.svg
              viewBox="0 0 800 800"
              animate={{ rotate: 360 }}
              transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
              className="absolute left-1/2 top-[54%] h-[920px] w-[920px] -translate-x-1/2 -translate-y-1/2 opacity-[0.04] will-change-transform"
              fill="none"
            >
              <circle cx="400" cy="400" r="340" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6 14" />
              <circle cx="400" cy="400" r="240" stroke="#64CEFB" strokeWidth="1" strokeDasharray="3 18" />
            </motion.svg>
          )}

          {/* Subtle Continuous Light Pulse Traveling Along Top Border Seam */}
          {!prefersReducedMotion && (
            <motion.div
              animate={{ x: ['-30%', '130%'] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
              className="absolute top-0 left-0 h-[1px] w-[26vw] bg-gradient-to-r from-transparent via-[#64CEFB]/70 to-transparent will-change-transform"
            />
          )}
        </div>

        {/* Generous Top Editorial Header */}
        <div
          ref={headerInnerRef}
          className="relative z-10 mx-auto w-full max-w-[1440px] shrink-0 px-5 pt-4 pb-2 sm:px-8 sm:pt-6 sm:pb-3 lg:px-14 lg:pt-7 lg:pb-4 [@media(max-height:600px)]:pt-2.5 [@media(max-height:600px)]:pb-1.5"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className="mb-1.5 flex items-center gap-2 font-space-mono text-[10px] tracking-[0.2em] uppercase text-[#64CEFB] sm:text-[10.5px] [@media(max-height:600px)]:mb-1">
                <span>Studio Process · Accessibility First</span>
              </p>

              <div className="flex items-baseline gap-2.5 sm:gap-3">
                <h2
                  id="better-seen-heading"
                  className="font-heading text-[clamp(1.8rem,min(4vw,5.8dvh),3.5rem)] font-normal leading-[0.95] tracking-tight text-white"
                >
                  A better way <span className="italic">to be seen</span>.
                </h2>

                <div
                  aria-hidden="true"
                  className="relative inline-flex h-[1.2em] items-center overflow-hidden font-space-mono text-[12.5px] font-medium text-[#64CEFB] tabular-nums sm:text-[13px]"
                >
                  <span>(</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={activeSlide}
                      initial={prefersReducedMotion ? false : { y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { y: -10, opacity: 0 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="inline-block"
                    >
                      0{activeSlide + 1}
                    </motion.span>
                  </AnimatePresence>
                  <span>)</span>
                </div>
              </div>

              <p className="mt-1.5 max-w-[54ch] text-[13px] leading-[1.5] text-white/80 sm:mt-2 sm:text-[14px] [@media(max-height:580px)]:hidden">
                Five deliberate stages, each with clarity and WCAG accessibility built in — from
                initial brief to live launch.
              </p>
            </div>

            <span className="hidden font-space-mono text-[11px] tracking-[0.16em] uppercase text-white/65 md:inline">
              Scroll, drag, or use arrow keys
            </span>
          </motion.div>
        </div>

        {/* Spacious Horizontal Card Deck with Continuous 120fps Compositor Transforms */}
        <div
          tabIndex={0}
          aria-label="Studio process stages carousel. Scroll, drag horizontally, or press left and right arrow keys to move between cards."
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          className="relative z-10 flex w-full flex-1 cursor-grab active:cursor-grabbing items-center overflow-x-clip overflow-y-visible py-2 sm:py-3 touch-pan-y select-none [perspective:1600px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/75"
        >
          <div
            ref={(el) => {
              trackRef.current = el;
              localTrackRef.current = el;
            }}
            className="flex items-stretch gap-4 will-change-transform sm:gap-7 lg:gap-8"
          >
            {STAGES.map((stage, idx) => {
              const isActive = activeSlide === idx;

              return (
                <article
                  key={stage.num}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  id={`carousel-panel-${idx}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Stage ${stage.num} of 0${TOTAL_STAGES}: ${stage.title}`}
                  onPointerMove={handleCardSpotlightMove}
                  onClick={() => {
                    if (!isActive) scrollToSlide(idx);
                  }}
                  className={`group/card relative flex min-h-[360px] w-[86vw] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-b from-[#11131A] via-[#0B0C10] to-[#070709] will-change-[transform,opacity] transition-[border-color] duration-300 ease-out sm:min-h-[395px] sm:w-[68vw] md:w-[54vw] lg:w-[44vw] max-w-[560px] ${
                    isActive
                      ? 'border-white/28 shadow-[0_28px_80px_rgba(0,0,0,0.9),0_0_42px_rgba(100,206,251,0.08)]'
                      : 'border-white/10 shadow-[0_18px_46px_rgba(0,0,0,0.8)] cursor-pointer'
                  }`}
                >
                  {/* Precision Studio Corner Brackets (smoothly fades with border state) */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-2.5 z-30 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-[#64CEFB]/55" />
                    <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-[#64CEFB]/55" />
                    <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-white/25" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-white/25" />
                  </div>

                  {/* Continuous Smooth Top Rim Highlight (opacity driven per-frame by card focus, zero layout projection jitter) */}
                  <span
                    ref={(el) => {
                      rimRefs.current[idx] = el;
                    }}
                    aria-hidden="true"
                    style={{ opacity: idx === 0 ? 1 : 0 }}
                    className="pointer-events-none absolute inset-x-8 top-0 z-30 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[#64CEFB] to-transparent"
                  />

                  {/* Subtle Pointer-Follow Surface Spotlight */}
                  {isActive && !prefersReducedMotion && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                      style={{
                        background:
                          'radial-gradient(320px circle at var(--mx, 50%) var(--my, 35%), rgba(100,206,251,0.08), transparent 70%)',
                      }}
                    />
                  )}

                  {/* Subtle Oversized Watermark Index */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-2 select-none font-heading text-[6.5rem] leading-none tracking-tighter text-white/[0.035] sm:right-6 sm:text-[7.75rem]"
                  >
                    {stage.num}
                  </span>

                  {/* Top Editorial Copy Chamber */}
                  <div className="relative z-20 flex shrink-0 flex-col gap-2 px-4 pt-4 pb-3.5 sm:gap-2.5 sm:px-6 sm:pt-5 sm:pb-4 [@media(max-height:540px)]:gap-1 [@media(max-height:540px)]:py-2.5">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`inline-flex items-center gap-2 font-space-mono text-[12px] font-medium tracking-[0.14em] tabular-nums transition-colors duration-300 ${
                          isActive ? 'text-[#64CEFB]' : 'text-white/60'
                        }`}
                      >
                        <span>{stage.num}</span>
                      </span>

                      <span className="font-space-mono text-[10px] tracking-[0.14em] uppercase text-white/60">
                        {stage.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading text-[1.6rem] font-normal leading-none tracking-tight text-white sm:text-[1.95rem] [@media(max-height:540px)]:text-[1.35rem]">
                        {stage.title}
                      </h3>
                      <p className="mt-1.5 max-w-[44ch] text-[12.5px] leading-[1.48] text-white/82 sm:mt-2 sm:text-[13.5px] [@media(max-height:540px)]:hidden">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Interactive Dotted-Matrix Chamber */}
                  <div className="relative z-20 min-h-0 flex-1 border-t border-white/12 bg-[#070709] px-4 py-3.5 sm:px-6 sm:py-4 [@media(max-height:540px)]:py-2.5">
                    {/* Softly Vignetted Micro-Dot Canvas */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]"
                    />

                    <div className="relative z-10 h-full">
                      {idx === 0 && (
                        <Card01Discovery
                          isActive={isActive}
                          prefersReducedMotion={prefersReducedMotion}
                          onRequestFocus={() => {
                            if (!isActive) scrollToSlide(idx);
                          }}
                        />
                      )}
                      {idx === 1 && (
                        <Card02Direction
                          isActive={isActive}
                          prefersReducedMotion={prefersReducedMotion}
                          onRequestFocus={() => {
                            if (!isActive) scrollToSlide(idx);
                          }}
                        />
                      )}
                      {idx === 2 && (
                        <Card03DesignBuild
                          isActive={isActive}
                          prefersReducedMotion={prefersReducedMotion}
                          onRequestFocus={() => {
                            if (!isActive) scrollToSlide(idx);
                          }}
                        />
                      )}
                      {idx === 3 && (
                        <Card04AccessibilityLaunch
                          isActive={isActive}
                          prefersReducedMotion={prefersReducedMotion}
                          onRequestFocus={() => {
                            if (!isActive) scrollToSlide(idx);
                          }}
                        />
                      )}
                      {idx === 4 && (
                        <Card05Investment
                          isActive={isActive}
                          prefersReducedMotion={prefersReducedMotion}
                          onRequestFocus={() => {
                            if (!isActive) scrollToSlide(idx);
                          }}
                          onSelectPricing={(tierId) => onOpenEnquiry('Pricing', tierId)}
                        />
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Spacious Bottom Progress Bar */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col px-5 pt-2.5 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+16px))] sm:px-8 sm:pt-3 sm:pb-7 lg:px-14">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <span className="shrink-0 font-space-mono text-[11px] tracking-[0.12em] text-white tabular-nums sm:text-[11.5px]">
              {STAGES[activeSlide].num} <span className="text-white/45">/ 0{TOTAL_STAGES}</span>
            </span>

            {/* Continuous Progress Line */}
            <div className="relative h-px flex-1 overflow-hidden bg-white/15">
              <div
                ref={progressBarRef}
                className="h-[2px] w-full origin-left bg-[#64CEFB] shadow-[0_0_12px_rgba(100,206,251,0.55)] will-change-transform"
                style={{ transform: `scaleX(${(1 / TOTAL_STAGES).toFixed(4)})` }}
              />
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={activeSlide}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="inline shrink-0 font-body text-[12px] font-medium text-white/90 sm:text-[13px]"
              >
                {STAGES[activeSlide].title}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
