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
        {/* Subtle Architectural Studio Atmosphere (pure soft monochrome light & glass depth, no blue blobs) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.015)_44%,transparent_76%)]" />

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
              <circle cx="400" cy="400" r="240" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="3 18" />
            </motion.svg>
          )}

          {/* Subtle Continuous Light Pulse Traveling Along Top Border Seam */}
          {!prefersReducedMotion && (
            <motion.div
              animate={{ x: ['-30%', '130%'] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
              className="absolute top-0 left-0 h-[1px] w-[26vw] bg-gradient-to-r from-transparent via-white/55 to-transparent will-change-transform"
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
              <p className="mb-1.5 flex items-center gap-2 font-space-mono text-[10px] tracking-[0.2em] uppercase text-white/75 sm:text-[10.5px] [@media(max-height:600px)]:mb-1">
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
                  className="relative inline-flex h-[1.2em] items-center overflow-hidden font-space-mono text-[12.5px] font-medium text-white/85 tabular-nums sm:text-[13px]"
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

        {/* Spacious Horizontal Liquid-Glass Card Deck */}
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
                  className={`liquid-glass-strong group/card relative flex min-h-[360px] w-[86vw] shrink-0 flex-col justify-between rounded-[28px] will-change-[transform,opacity] transition-[background-color,box-shadow] duration-300 ease-out sm:min-h-[395px] sm:w-[68vw] sm:rounded-[32px] md:w-[54vw] lg:w-[44vw] max-w-[560px] ${
                    isActive
                      ? 'bg-white/[0.045] shadow-[0_28px_80px_rgba(0,0,0,0.88),inset_0_1px_1px_rgba(255,255,255,0.22)]'
                      : 'bg-white/[0.015] shadow-[0_18px_46px_rgba(0,0,0,0.72)] cursor-pointer'
                  }`}
                >
                  {/* Soft Liquid-Glass Diagonal Sheen */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.02)_26%,transparent_55%,rgba(255,255,255,0.035)_100%)]"
                  />

                  {/* Continuous Smooth Top Specular Rim Highlight */}
                  <span
                    ref={(el) => {
                      rimRefs.current[idx] = el;
                    }}
                    aria-hidden="true"
                    style={{ opacity: idx === 0 ? 1 : 0 }}
                    className="pointer-events-none absolute inset-x-10 top-0 z-30 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-white/85 to-transparent"
                  />

                  {/* Subtle Pointer-Follow Specular Glass Reflection */}
                  {isActive && !prefersReducedMotion && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                      style={{
                        background:
                          'radial-gradient(320px circle at var(--mx, 50%) var(--my, 35%), rgba(255,255,255,0.09), transparent 70%)',
                      }}
                    />
                  )}

                  {/* Subtle Oversized Watermark Index */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 top-2 select-none font-heading text-[6.5rem] leading-none tracking-tighter text-white/[0.04] sm:right-7 sm:text-[7.75rem]"
                  >
                    {stage.num}
                  </span>

                  {/* Top Editorial Copy Chamber */}
                  <div className="relative z-20 flex shrink-0 flex-col gap-2 px-4 pt-4 pb-3 sm:gap-2.5 sm:px-6 sm:pt-5 sm:pb-3.5 [@media(max-height:540px)]:gap-1 [@media(max-height:540px)]:py-2.5">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`inline-flex items-center gap-2 font-space-mono text-[12px] font-medium tracking-[0.14em] tabular-nums transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-white/60'
                        }`}
                      >
                        <span>{stage.num}</span>
                      </span>

                      <span className="font-space-mono text-[10px] tracking-[0.14em] uppercase text-white/65">
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

                  {/* Bottom Inset Rounded Frosted Liquid-Glass Chamber (r_inner = r_outer - margin) */}
                  <div className="relative z-20 mx-2.5 mb-2.5 min-h-0 flex-1 overflow-hidden rounded-[18px] border border-white/14 bg-white/[0.03] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl sm:mx-3 sm:mb-3 sm:rounded-[20px] sm:px-5 sm:py-3.5 [@media(max-height:540px)]:py-2">
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

        {/* Spacious Rounded Liquid-Glass Bottom Progress Bar */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col px-5 pt-2 pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+14px))] sm:px-8 sm:pt-2.5 sm:pb-6 lg:px-14">
          <div className="liquid-glass-strong flex items-center gap-3.5 rounded-full bg-white/[0.03] px-4 py-2.5 sm:gap-4 sm:px-5">
            <span className="shrink-0 font-space-mono text-[11px] tracking-[0.12em] text-white tabular-nums sm:text-[11.5px]">
              {STAGES[activeSlide].num} <span className="text-white/50">/ 0{TOTAL_STAGES}</span>
            </span>

            {/* Continuous Rounded Progress Line */}
            <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                ref={progressBarRef}
                className="h-full w-full origin-left rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.45)] will-change-transform"
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
