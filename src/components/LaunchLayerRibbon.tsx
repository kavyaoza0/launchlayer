import { ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RIBBON_PROJECTS } from './ribbon/ribbonProjects';
import { RibbonPreviewCard } from './ribbon/RibbonPreviewCard';

interface LaunchLayerRibbonProps {
  id?: string;
}

interface ResponsiveGeometry {
  cardWidth: number;
  cardHeight: number;
  radius: number;
  perspective: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function computeGeometry(vw: number): ResponsiveGeometry {
  let cardWidth: number;
  let perspective: number;

  if (vw < 640) {
    cardWidth = clamp(vw * 0.72, 240, 292);
    perspective = 1000;
  } else if (vw < 1024) {
    cardWidth = clamp(vw * 0.42, 300, 380);
    perspective = 1350;
  } else {
    cardWidth = clamp(vw * 0.305, 380, 480);
    perspective = 1750;
  }

  const w = Math.round(cardWidth);
  const h = Math.round((w * 9) / 16);
  const radius = Math.round(w * (vw < 640 ? 2.82 : 2.88));

  return {
    cardWidth: w,
    cardHeight: h,
    radius,
    perspective,
  };
}

export function LaunchLayerRibbon({ id = 'work' }: LaunchLayerRibbonProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reflectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isInView = useInView(sectionRef, { once: true, amount: 0.14 });

  const [isDraggingUI, setIsDraggingUI] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const focusedIndexRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [geo, setGeo] = useState<ResponsiveGeometry>(() =>
    typeof window !== 'undefined'
      ? computeGeometry(window.innerWidth)
      : { cardWidth: 440, cardHeight: 248, radius: 1267, perspective: 1750 }
  );

  const total = RIBBON_PROJECTS.length;
  const angleStepDeg = 360 / total;

  // High-frequency 60fps physics & 3D cylinder transform state outside React re-renders
  const animRef = useRef({
    targetAngle: 0,
    currentAngle: 0,
    springVel: 0,
    coastVel: 0,
    isDragging: false,
    dragLockedAxis: null as 'x' | 'y' | null,
    dragMoved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastMoveTime: 0,
    hoveredIdx: null as number | null,
    localTiltX: 0,
    localTiltY: 0,
    hoverMix: new Array<number>(total).fill(0),
    isPaused: false,
    prefersReducedMotion: false,
    radius: geo.radius,
    cardWidth: geo.cardWidth,
  });

  useEffect(() => {
    animRef.current.radius = geo.radius;
    animRef.current.cardWidth = geo.cardWidth;
  }, [geo.radius, geo.cardWidth]);

  useEffect(() => {
    animRef.current.isPaused = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const handleResize = () => {
      setGeo(computeGeometry(window.innerWidth));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    animRef.current.prefersReducedMotion = mq.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      animRef.current.prefersReducedMotion = e.matches;
      if (e.matches) {
        animRef.current.coastVel = 0;
        animRef.current.springVel = 0;
        animRef.current.currentAngle = animRef.current.targetAngle;
      }
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Mouse wheel rotation (supports trackpad horizontal scroll, shift+wheel, and gentle vertical nudge)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      const a = animRef.current;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      if (absX > absY || e.shiftKey) {
        e.preventDefault();
        const delta = e.shiftKey && absY > absX ? e.deltaY : e.deltaX;
        const impulse = -delta * 0.085;
        a.targetAngle += impulse;
        a.coastVel = clamp(a.coastVel + impulse * 4.5, -120, 120);
      } else if (absY > 0) {
        // Rotate gently in response to wheel while preserving vertical page scrolling
        const impulse = -e.deltaY * 0.048;
        a.targetAngle += impulse;
        a.coastVel = clamp(a.coastVel + impulse * 3.2, -95, 95);
      }
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    return () => stage.removeEventListener('wheel', handleWheel);
  }, []);

  // Global pointermove / pointerup listeners for crisp drag & one-finger touch swiping
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const a = animRef.current;
      if (!a.isDragging) return;

      const dxTotal = e.clientX - a.startX;
      const dyTotal = e.clientY - a.startY;

      if (!a.dragLockedAxis) {
        if (Math.abs(dxTotal) < 6 && Math.abs(dyTotal) < 6) return;
        a.dragLockedAxis = Math.abs(dxTotal) >= Math.abs(dyTotal) ? 'x' : 'y';
        if (a.dragLockedAxis === 'y') {
          a.isDragging = false;
          setIsDraggingUI(false);
          return;
        }
        a.dragMoved = true;
        setIsDraggingUI(true);
      }

      const now = performance.now();
      const dt = Math.max((now - a.lastMoveTime) / 1000, 0.004);
      const stepDx = e.clientX - a.lastX;

      // Convert horizontal pixels into cylindrical degrees around the arc
      const degPerPx = 42 / Math.max(a.cardWidth, 240);
      const deltaDeg = stepDx * degPerPx;

      a.targetAngle += deltaDeg;
      a.coastVel = clamp((deltaDeg / dt) * 0.42, -165, 165);
      a.lastX = e.clientX;
      a.lastMoveTime = now;
    };

    const stopDragging = () => {
      const a = animRef.current;
      if (!a.isDragging) return;
      a.isDragging = false;
      a.dragLockedAxis = null;
      setIsDraggingUI(false);
      if (a.dragMoved) {
        window.setTimeout(() => {
          a.dragMoved = false;
        }, 60);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', stopDragging, { passive: true });
    window.addEventListener('pointercancel', stopDragging, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, []);

  // Main 60fps spring & 3D cylindrical ring transform loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const a = animRef.current;

      if (!a.isDragging) {
        // Continuous slow idle rotation; slows on hover, stops under reduced motion or pause
        if (!a.prefersReducedMotion && !a.isPaused) {
          const idleDegPerSec = a.hoveredIdx !== null ? 1.05 : 4.15;
          a.targetAngle -= idleDegPerSec * dt;
        }

        // Apply inertial coasting momentum
        if (Math.abs(a.coastVel) > 0.02) {
          a.targetAngle += a.coastVel * dt;
          a.coastVel *= Math.pow(0.055, dt);
        } else {
          a.coastVel = 0;
        }
      }

      if (a.prefersReducedMotion) {
        a.currentAngle = a.targetAngle;
        a.springVel = 0;
      } else {
        // Smooth critically damped spring toward targetAngle
        const stiffness = 140;
        const damping = 22;
        const force = (a.targetAngle - a.currentAngle) * stiffness;
        const accel = force - a.springVel * damping;
        a.springVel += accel * dt;
        a.currentAngle += a.springVel * dt;
      }

      let frontBestIdx = 0;
      let frontBestCos = -2;

      for (let i = 0; i < total; i++) {
        const cardEl = cardRefs.current[i];
        const reflEl = reflectionRefs.current[i];
        if (!cardEl) continue;

        let deg = (i * angleStepDeg + a.currentAngle) % 360;
        if (deg > 180) deg -= 360;
        if (deg < -180) deg += 360;

        const rad = (deg * Math.PI) / 180;
        const cosT = Math.cos(rad);
        const sinT = Math.sin(rad);

        if (cosT > frontBestCos) {
          frontBestCos = cosT;
          frontBestIdx = i;
        }

        const isCardHovered = a.hoveredIdx === i && !a.isDragging && !a.prefersReducedMotion;
        const targetHover = isCardHovered ? 1 : 0;
        a.hoverMix[i] += (targetHover - a.hoverMix[i]) * (a.prefersReducedMotion ? 1 : 0.16);
        const hMix = a.hoverMix[i];

        // Hide back-of-cylinder cards smoothly before crossing +-90deg
        const visibility = smoothstep(0.08, 0.36, cosT);
        const finalOpacity = clamp(visibility + hMix * 0.18 * visibility, 0, 1);

        // True cylindrical arc geometry + subtle hover lift toward camera
        const tx = sinT * a.radius;
        const tz = (cosT - 1) * a.radius + hMix * 40;
        const ty = hMix * -6;

        // Slight cursor-tracking tilt on the hovered card
        const tiltY = isCardHovered ? a.localTiltX * 7.2 * hMix : 0;
        const tiltX = isCardHovered ? -a.localTiltY * 5.4 * hMix : 0;
        const rotY = deg + tiltY;

        // Subtle foreground depth scale + hover enlargement
        const depthScale = 0.88 + 0.12 * smoothstep(0.25, 1.0, cosT);
        const scale = depthScale * (1 + hMix * 0.068);

        const zIndex = Math.round((cosT + 1) * 100) + (hMix > 0.05 ? 45 : 0);

        cardEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, ${tz.toFixed(
          2
        )}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg) scale3d(${scale.toFixed(
          4
        )}, ${scale.toFixed(4)}, 1)`;
        cardEl.style.opacity = finalOpacity.toFixed(3);
        cardEl.style.zIndex = String(zIndex);
        cardEl.style.pointerEvents = cosT > 0.22 ? 'auto' : 'none';

        if (reflEl) {
          const reflOpacity = visibility * (0.22 + hMix * 0.14) * smoothstep(0.42, 1.0, cosT);
          reflEl.style.opacity = reflOpacity.toFixed(3);
        }
      }

      // Sync keyboard focus tracking gently when idle without unnecessary churn
      if (frontBestIdx !== focusedIndexRef.current && Math.abs(a.springVel) < 1.5 && !a.isDragging) {
        focusedIndexRef.current = frontBestIdx;
        setFocusedIndex(frontBestIdx);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [angleStepDeg, total]);

  const rotateToCard = useCallback(
    (index: number) => {
      const a = animRef.current;
      const desiredMod = -index * angleStepDeg;
      let delta = (desiredMod - a.targetAngle) % 360;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      a.coastVel = 0;
      a.targetAngle += delta;
      const normalized = ((index % total) + total) % total;
      focusedIndexRef.current = normalized;
      setFocusedIndex(normalized);
    },
    [angleStepDeg, total]
  );

  const handleStagePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const a = animRef.current;
    a.isDragging = true;
    a.dragLockedAxis = null;
    a.dragMoved = false;
    a.startX = e.clientX;
    a.startY = e.clientY;
    a.lastX = e.clientX;
    a.lastMoveTime = performance.now();
    a.coastVel = 0;
  };

  const handleCardPointerMove = (index: number, e: ReactPointerEvent<HTMLDivElement>) => {
    if (animRef.current.isDragging || animRef.current.hoveredIdx !== index) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    const ny = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    animRef.current.localTiltX = nx;
    animRef.current.localTiltY = ny;
  };

  const handleCardEnter = (index: number) => {
    animRef.current.hoveredIdx = index;
    setHoveredIndex(index);
  };

  const handleCardLeave = () => {
    animRef.current.hoveredIdx = null;
    animRef.current.localTiltX = 0;
    animRef.current.localTiltY = 0;
    setHoveredIndex(null);
  };

  const handleCardClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (animRef.current.dragMoved) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      rotateToCard((focusedIndex + 1) % total);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      rotateToCard((focusedIndex - 1 + total) % total);
    } else if (e.key === ' ') {
      if ((e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    }
  };

  const activeProject = RIBBON_PROJECTS[focusedIndex];

  return (
    <section
      id={id}
      ref={sectionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="LaunchLayer 3D Website Preview Ribbon"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="ll-section-seam relative flex h-[min(78dvh,680px)] min-h-[440px] w-full items-center justify-center overflow-hidden bg-black select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60"
    >
      {/* Screen-reader accessible live status & keyboard-only controls */}
      <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:bottom-5 focus-within:left-6 focus-within:z-50 focus-within:flex focus-within:items-center focus-within:gap-3 focus-within:border focus-within:border-white/25 focus-within:bg-black focus-within:p-3">
        <span aria-live="polite" className="text-xs text-white">
          {activeProject.number} of {total}: {activeProject.title} — {activeProject.category}
        </span>
        <button
          type="button"
          onClick={() => rotateToCard((focusedIndex - 1 + total) % total)}
          className="min-h-[40px] border border-white/25 px-3 text-xs text-white focus-visible:ring-2 focus-visible:ring-white"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => rotateToCard((focusedIndex + 1) % total)}
          className="min-h-[40px] border border-white/25 px-3 text-xs text-white focus-visible:ring-2 focus-visible:ring-white"
        >
          Next
        </button>
        <button
          type="button"
          aria-pressed={isPaused}
          onClick={() => setIsPaused((prev) => !prev)}
          className="min-h-[40px] border border-white/25 px-3 text-xs text-white focus-visible:ring-2 focus-visible:ring-white"
        >
          {isPaused ? 'Resume motion' : 'Pause motion'}
        </button>
      </div>

      {/* Subtle monochrome studio horizon lighting & floor vignette */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[960px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.065)_0%,transparent_72%)] blur-[96px]" />
        <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent sm:w-24 lg:w-36" />
        <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent sm:w-24 lg:w-36" />
      </div>

      {/* Interactive 3D Cylindrical Stage */}
      <div
        ref={stageRef}
        onPointerDown={handleStagePointerDown}
        style={{
          perspective: `${geo.perspective}px`,
          perspectiveOrigin: '50% 48%',
          touchAction: 'pan-y',
        }}
        className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
          isDraggingUI ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          className="preserve-3d relative flex items-center justify-center"
          style={{ width: geo.cardWidth, height: geo.cardHeight }}
        >
          {RIBBON_PROJECTS.map((project, index) => {
            const isHovered = hoveredIndex === index && !isDraggingUI;

            return (
              <div
                key={project.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onPointerEnter={() => handleCardEnter(index)}
                onPointerMove={(e) => handleCardPointerMove(index, e)}
                onPointerLeave={handleCardLeave}
                style={{
                  width: geo.cardWidth,
                  height: geo.cardHeight,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className="preserve-3d absolute inset-0 will-change-transform"
              >
                {/* Staggered entrance motion wrapper */}
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 20, scale: 0.96 }
                  }
                  animate={
                    isInView
                      ? { opacity: 1, y: 0, scale: 1 }
                      : prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 20, scale: 0.96 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.65,
                    delay: prefersReducedMotion ? 0 : Math.min(index, 7) * 0.055,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative h-full w-full"
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCardClick}
                    onFocus={() => {
                      rotateToCard(index);
                      handleCardEnter(index);
                    }}
                    onBlur={handleCardLeave}
                    aria-label={`${project.number}: ${project.title} (${project.category}) — Open project preview`}
                    className={`group relative block h-full w-full overflow-hidden rounded-xl border bg-[#080808] transition-[border-color,box-shadow,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      isHovered
                        ? 'border-white/55 shadow-[0_28px_72px_rgba(0,0,0,0.94),0_0_28px_rgba(255,255,255,0.14)] brightness-105'
                        : 'border-white/14 shadow-[0_24px_64px_rgba(0,0,0,0.88)]'
                    }`}
                  >
                    {/* Live 16:9 Website Preview */}
                    <div className="h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.018]">
                      <RibbonPreviewCard project={project} />
                    </div>

                    {/* Restrained specular top-edge sheen */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_42%)]"
                    />

                    {/* Subtle clip-path + opacity reveal of project number, title, category & arrow */}
                    <div
                      className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/15 bg-black/82 px-3.5 py-2.5 backdrop-blur-md transition-[clip-path,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-4 ${
                        isHovered
                          ? 'opacity-100 [clip-path:inset(0%_0%_0%_0%)]'
                          : 'opacity-0 [clip-path:inset(100%_0%_0%_0%)] group-focus-visible:opacity-100 group-focus-visible:[clip-path:inset(0%_0%_0%_0%)]'
                      }`}
                    >
                      <div className="flex min-w-0 items-baseline gap-2.5">
                        <span className="font-space-mono text-[10px] tracking-[0.1em] text-white/60 tabular-nums shrink-0">
                          {project.number}
                        </span>
                        <span className="truncate font-heading text-[16px] leading-none text-white sm:text-[17px]">
                          {project.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-body text-[11px] text-white/65">
                        <span className="whitespace-nowrap">{project.category}</span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-white/85 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </a>
                </motion.div>

                {/* Subtle monochrome reflection beneath each floating card */}
                <div
                  ref={(el) => {
                    reflectionRefs.current[index] = el;
                  }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 -bottom-11 h-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.16)_0%,transparent_74%)] blur-md"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LaunchLayerRibbon;
