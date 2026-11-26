import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RIBBON_PROJECTS, WORLD_META } from './ribbon/ribbonProjects';
import { RibbonPreviewCard } from './ribbon/RibbonPreviewCard';

interface LaunchLayerRibbonProps {
  id?: string;
}

const TOTAL_SLOTS = RIBBON_PROJECTS.length; // 16
const WORDMARK_CHARS = Array.from('Tesselo.');
const CAPTION_TEXT = 'LOADING SITES';

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// Exact numerical cubic-bezier solver matching CSS timing functions
function solveCubicBezier(p1x: number, p1y: number, p2x: number, p2y: number, x: number): number {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;

  let t = clamp(x, 0, 1);
  for (let i = 0; i < 5; i++) {
    const err = sampleX(t) - x;
    const d = sampleDX(t);
    if (Math.abs(err) < 1e-5 || Math.abs(d) < 1e-6) break;
    t = clamp(t - err / d, 0, 1);
  }
  return sampleY(t);
}

interface TiltSpringState {
  tx: number;
  vx: number;
  ty: number;
  vy: number;
  z: number;
  vz: number;
  targetX: number;
  targetY: number;
  targetZ: number;
}

export function LaunchLayerRibbon({ id = 'work' }: LaunchLayerRibbonProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const ringCenterRef = useRef<HTMLDivElement | null>(null);

  const slotRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const flipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoSnapLockUntilRef = useRef(0);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDraggingUI, setIsDraggingUI] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [announceMode, setAnnounceMode] = useState<'off' | 'polite'>('off');

  // Intro & loader UI states
  const [introStarted, setIntroStarted] = useState(false);
  const [loaderStage, setLoaderStage] = useState<'idle' | 'loading' | 'revealing' | 'done'>('idle');
  const [introComplete, setIntroComplete] = useState(false);
  const [typedCaption, setTypedCaption] = useState('');
  const [displayPercent, setDisplayPercent] = useState(0);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Slot mapping note from spec: N = 16 gives stable offset of +3 slots
  const siteForSlot = useCallback((slotIdx: number) => {
    return RIBBON_PROJECTS[((slotIdx + 3) % TOTAL_SLOTS + TOTAL_SLOTS) % TOTAL_SLOTS];
  }, []);

  const stateRef = useRef({
    introStarted: false,
    introComplete: false,
    revealTriggered: false,
    isSectionVisible: false,
    isDocHidden: false,
    prefersReducedMotion: prefersReducedMotion,

    // Timeline values
    formationStartTime: 0,
    expansionStartTime: 0,
    formation: 0, // 0..1 linearly over 2.6s
    expansion: 0, // 0..1 eased over 1.9s

    // LaunchLayer card asset readiness tracking
    assetsSettled: 0,
    assetsDone: false,

    // Ring rotation spring: g follows m (stiffness 150, damping 27, mass 1)
    m: 0,
    g: 0,
    gVel: 0,
    E: 1, // Speed factor lerps to 0.2 when hovering a card, 1.0 otherwise

    // Pointer / drag / wheel / focus state
    isDragging: false,
    activePointerId: null as number | null,
    dragType: null as 'mouse' | 'touch' | null,
    dragLockedAxis: null as 'x' | 'y' | null,
    dragStartX: 0,
    dragStartY: 0,
    dragStartM: 0,
    dragMoved: false,
    lastDragEndTime: 0,
    pointerClientX: -9999,
    pointerClientY: -9999,
    hoveredIdx: null as number | null,
    focusedInsideWall: false,
    pendingSwipeAnnounce: false,
    frameCounter: 0,

    // Per-card tilt spring states (stiffness 180, damping 24)
    tilts: Array.from({ length: TOTAL_SLOTS }, (): TiltSpringState => ({
      tx: 0,
      vx: 0,
      ty: 0,
      vy: 0,
      z: 0,
      vz: 0,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
    })),
  });

  // Track LaunchLayer project card image/surface readiness
  const handleAssetSettled = useCallback(() => {
    const s = stateRef.current;
    s.assetsSettled = Math.min(TOTAL_SLOTS, s.assetsSettled + 1);
    if (s.assetsSettled >= TOTAL_SLOTS) {
      s.assetsDone = true;
    }
  }, []);

  // Immediately skip intro to final interactive 3D cylinder
  const skipIntro = useCallback(() => {
    const s = stateRef.current;
    if (s.introComplete) return;
    const activeEl = document.activeElement as HTMLElement | null;
    const wasInsideSection = Boolean(activeEl && sectionRef.current?.contains(activeEl));

    s.introStarted = true;
    s.formation = 1;
    s.expansion = 1;
    s.assetsDone = true;
    s.revealTriggered = true;
    s.introComplete = true;
    s.m = 78;
    s.g = 78;
    s.gVel = 0;

    setDisplayPercent(100);
    setIntroStarted(true);
    setLoaderStage('done');
    setIntroComplete(true);

    if (wasInsideSection) {
      window.requestAnimationFrame(() => {
        const target = slotRefs.current[focusedIndex] ?? slotRefs.current[0];
        target?.focus({ preventScroll: true });
      });
    }
  }, [focusedIndex]);

  // Reduced motion listener
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (matches: boolean) => {
      setPrefersReducedMotion(matches);
      stateRef.current.prefersReducedMotion = matches;
      if (matches) {
        skipIntro();
      }
    };
    apply(mq.matches);

    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [skipIntro]);

  // Low-threshold magnetic arrival snap + complete-viewport intro trigger:
  // 1) A gentle scroll downward from Section 1 (Hero) smoothly docks Section 2 flush to top (0..vh)
  //    so the user never has to push hard to isolate this section cleanly.
  // 2) Scrolling upward from Section 3 smoothly docks Section 2 back to 100dvh, while exiting
  //    upward to Hero or downward past the sticky chamber into Section 3 stays completely natural.
  // 3) The opening sequence begins ONLY once the user has arrived completely inside Section 2
  //    (0px of Hero above and 0px of Section 3 below).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let startTypingTimer: number | null = null;
    let typeTimer: number | null = null;
    let failsafeTimer: number | null = null;
    let settleTimer: number | null = null;
    let lastScrollY = window.scrollY;

    const beginIntro = () => {
      const s = stateRef.current;
      if (s.introStarted) return;
      s.introStarted = true;
      setIntroStarted(true);

      if (s.prefersReducedMotion) {
        skipIntro();
        return;
      }

      // Dock cleanly to section top before locking scroll during the entrance sequence
      const rect = section.getBoundingClientRect();
      if (Math.abs(rect.top) > 2) {
        autoSnapLockUntilRef.current = performance.now() + 450;
        window.scrollTo({ top: Math.round(window.scrollY + rect.top), behavior: 'auto' });
      }

      s.formationStartTime = performance.now();
      setLoaderStage('loading');

      // Type "LOADING SITES" 1 char every 45ms starting at 350ms
      let charCount = 0;
      startTypingTimer = window.setTimeout(() => {
        typeTimer = window.setInterval(() => {
          charCount += 1;
          setTypedCaption(CAPTION_TEXT.slice(0, charCount));
          if (charCount >= CAPTION_TEXT.length && typeTimer !== null) {
            window.clearInterval(typeTimer);
            typeTimer = null;
          }
        }, 45);
      }, 350);

      // Failsafe so even slow connections still hit 100% cleanly
      failsafeTimer = window.setTimeout(() => {
        s.assetsDone = true;
      }, 3500);
    };

    const checkCompleteArrival = () => {
      const s = stateRef.current;
      if (s.introStarted) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Section occupies the full 100dvh viewport exclusively
      if (rect.top <= 16 && rect.bottom >= vh - 16) {
        beginIntro();
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dir = y >= lastScrollY ? 'down' : 'up';
      lastScrollY = y;

      checkCompleteArrival();

      if (stateRef.current.prefersReducedMotion) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;
      if (performance.now() < autoSnapLockUntilRef.current) return;

      if (settleTimer !== null) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (stateRef.current.isDragging) return;
        if (performance.now() < autoSnapLockUntilRef.current) return;

        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight || 1;

        // Low-threshold downward arrival from Hero: once >=12% of Section 2 enters viewport, glide cleanly to top=0
        if (dir === 'down' && rect.top > 4 && rect.top < vh * 0.88) {
          autoSnapLockUntilRef.current = performance.now() + 650;
          window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });
        } else if (dir === 'up' && rect.top < 0 && rect.bottom > vh * 0.14 && rect.bottom < vh - 4) {
          // Upward re-entry from Section 3: glide cleanly so Section 2 bottom aligns flush with viewport bottom
          autoSnapLockUntilRef.current = performance.now() + 650;
          window.scrollTo({ top: window.scrollY + (rect.bottom - vh), behavior: 'smooth' });
        }
      }, 85);
    };

    const observer = new IntersectionObserver(
      () => {
        checkCompleteArrival();
      },
      { threshold: [0, 0.5, 0.9, 0.98, 1] }
    );

    observer.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkCompleteArrival, { passive: true });

    // Initial check in case loaded directly at #work
    checkCompleteArrival();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', checkCompleteArrival);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      if (startTypingTimer !== null) window.clearTimeout(startTypingTimer);
      if (typeTimer !== null) window.clearInterval(typeTimer);
      if (failsafeTimer !== null) window.clearTimeout(failsafeTimer);
    };
  }, [skipIntro]);

  // Briefly lock page scroll only on desktop fine-pointer devices while the entrance plays;
  // never lock vertical touch scrolling on mobile/coarse devices so screen-reader & touch navigation stay unrestricted
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (loaderStage !== 'loading' && loaderStage !== 'revealing') return;
    const isCoarsePointer =
      typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isCoarsePointer) return;

    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = bodyEl.style.overflow;
    const prevOverscroll = htmlEl.style.overscrollBehavior;
    const prevPaddingRight = bodyEl.style.paddingRight;

    const scrollbarWidth = Math.max(0, window.innerWidth - htmlEl.clientWidth);
    if (scrollbarWidth > 0) {
      bodyEl.style.paddingRight = `${scrollbarWidth}px`;
    }
    htmlEl.style.overflow = 'hidden';
    bodyEl.style.overflow = 'hidden';
    htmlEl.style.overscrollBehavior = 'none';

    const preventWheel = (e: WheelEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    const preventScrollKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        skipIntro();
        return;
      }
      if ([' ', 'Spacebar', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventWheel, { passive: false });
    window.addEventListener('keydown', preventScrollKeys);

    return () => {
      htmlEl.style.overflow = prevHtmlOverflow;
      bodyEl.style.overflow = prevBodyOverflow;
      htmlEl.style.overscrollBehavior = prevOverscroll;
      bodyEl.style.paddingRight = prevPaddingRight;
      window.removeEventListener('wheel', preventWheel);
      window.removeEventListener('keydown', preventScrollKeys);
    };
  }, [loaderStage, prefersReducedMotion, skipIntro]);

  // Drag & Touch rotation listeners (drag-only rotation; scrolling up/down never spins cards)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const s = stateRef.current;
      s.pointerClientX = e.clientX;
      s.pointerClientY = e.clientY;

      if (!s.isDragging || !s.introComplete) return;
      if (s.activePointerId !== null && e.pointerId !== s.activePointerId) return;

      const dx = e.clientX - s.dragStartX;
      const dy = e.clientY - s.dragStartY;

      if (s.dragType === 'touch' && !s.dragLockedAxis) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        s.dragLockedAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        if (s.dragLockedAxis === 'y') {
          s.isDragging = false;
          s.activePointerId = null;
          setIsDraggingUI(false);
          return;
        }
      }

      const moveThreshold = s.dragType === 'touch' ? 12 : 5;
      if (Math.abs(dx) > moveThreshold || Math.abs(dy) > moveThreshold) {
        s.dragMoved = true;
      }

      if (s.dragType === 'touch' && s.dragLockedAxis === 'x' && e.cancelable) {
        e.preventDefault();
      }

      const sensitivity = s.dragType === 'touch' ? 0.34 : 0.2;
      s.m = s.dragStartM + sensitivity * dx;
      if (s.prefersReducedMotion) {
        s.g = s.m;
      }
    };

    const stopDrag = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s.isDragging) return;
      if (s.activePointerId !== null && e.pointerId !== s.activePointerId) return;
      s.isDragging = false;
      s.activePointerId = null;
      s.dragType = null;
      s.dragLockedAxis = null;
      setIsDraggingUI(false);
      if (s.dragMoved) {
        s.lastDragEndTime = performance.now();
        s.pendingSwipeAnnounce = true;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', stopDrag, { passive: true });
    window.addEventListener('pointercancel', stopDrag, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDrag);
      window.removeEventListener('pointercancel', stopDrag);
    };
  }, []);

  // Main 60fps reference geometry, spring physics, formation & expansion loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let loaderDoneTimer: number | null = null;
    let expansionDoneTimer: number | null = null;

    const tick = (now: number) => {
      const s = stateRef.current;
      if (!s.isSectionVisible || s.isDocHidden) {
        rafId = 0;
        return;
      }

      const dtMs = Math.max(1, now - lastTime);
      const dtSec = Math.min(dtMs / 1000, 0.033);
      const k = Math.min(3, dtMs / 16.67);
      lastTime = now;

      // 1. Progress opening sequence: formation (0->1 over 2.6s) + synchronized odometer reveal
      if (s.introStarted && !s.introComplete) {
        if (!s.revealTriggered) {
          const elapsed = now - s.formationStartTime;
          s.formation = clamp(elapsed / 2600, 0, 1);

          // Pace odometer smoothly across ~2.1s of formation while respecting actual asset readiness
          const easedTimePct = Math.round(
            solveCubicBezier(0.22, 1, 0.36, 1, clamp(elapsed / 2100, 0, 1)) * 100
          );
          const readyCap = s.assetsDone
            ? 100
            : Math.max(18, Math.round((s.assetsSettled / TOTAL_SLOTS) * 100));
          const targetPct = Math.min(easedTimePct, readyCap);
          setDisplayPercent((prev) => (prev !== targetPct ? targetPct : prev));

          // Trigger Reveal when formation >= 1 AND assets are settled (or failsafe elapsed)
          if (s.formation >= 1 && s.assetsDone) {
            s.revealTriggered = true;
            s.expansionStartTime = now;
            setDisplayPercent(100);
            setLoaderStage('revealing');

            loaderDoneTimer = window.setTimeout(() => {
              setLoaderStage('done');
            }, 1000);

            expansionDoneTimer = window.setTimeout(() => {
              s.expansion = 1;
              s.introComplete = true;
              setIntroComplete(true);
            }, 1900);
          }
        } else {
          // Expansion goes 0 -> 1 over 1.9s with cubic-bezier(0.5, 0, 0.15, 1)
          const rawExp = clamp((now - s.expansionStartTime) / 1900, 0, 1);
          s.expansion = solveCubicBezier(0.5, 0, 0.15, 1, rawExp);
        }
      }

      const e = s.introComplete ? 1 : s.expansion;
      const f = s.introComplete ? 1 : s.formation;

      // 2. Determine hover slowdown factor E (checks pointer hit every 3rd frame)
      s.frameCounter = (s.frameCounter + 1) % 3;
      let overCard = s.hoveredIdx !== null;
      if (s.frameCounter === 0 && s.introComplete && s.pointerClientX > -100) {
        const hit = document.elementFromPoint(s.pointerClientX, s.pointerClientY);
        overCard = Boolean(hit?.closest?.('[data-ribbon-card="true"]'));
      }
      const targetE = overCard ? 0.2 : 1;
      s.E += (targetE - s.E) * Math.min(1, 0.08 * k);

      // 3. Rotation target m + spring-damped angle g (stiffness 150, damping 27, mass 1)
      if (!s.prefersReducedMotion) {
        if (!s.introComplete && s.introStarted) {
          s.m += 0.3 * (0.5 + 0.5 * e) * clamp((78 - s.m) / 20, 0, 1) * s.E * k;
        } else if (s.introComplete && !s.isDragging && !s.focusedInsideWall) {
          s.m += 0.3 * s.E * k;
        }

        const force = (s.m - s.g) * 150;
        const accel = force - s.gVel * 27;
        s.gVel += accel * dtSec;
        s.g += s.gVel * dtSec;
      } else {
        s.g = s.m;
        s.gVel = 0;
      }

      // 4. Aspect-ratio-continuous Ring Geometry inside full 100dvh frame so entrance formation
      //    fits 100% inside mobile viewports and seamlessly interpolates to exploration scale
      const vw = window.innerWidth || 1440;
      const vh = window.innerHeight || 900;
      const isMobileViewport = vw < 640;

      const introScaleW = (vw - (isMobileViewport ? 36 : 48)) / (isMobileViewport ? 1180 : 1020);
      const introScaleH = (vh - (isMobileViewport ? 220 : 140)) / 500;
      const introScale = clamp(Math.min(introScaleW, introScaleH), 0.24, 1.04);

      const exploreScaleW = (vw - 32) / 920;
      const exploreScaleH = (vh - 80) / 420;
      const exploreScale = clamp(Math.min(exploreScaleW, exploreScaleH), isMobileViewport ? 0.36 : 0.46, 1.06);

      const responsiveScale = introScale * (1 - e) + exploreScale * e;

      const tiltDeg = -22 * (1 - e);
      const tiltRad = (tiltDeg * Math.PI) / 180;
      const radius = 450 + 1150 * e; // 450 -> 1600
      const anchor = -radius * Math.sin(tiltRad) + 450 * Math.sin((-22 * Math.PI) / 180) * (1 - e);
      const perspective = 1040 + (1140 - 1040) * e;
      const rollDeg = -20 * (1 - e);
      const rollRad = (rollDeg * Math.PI) / 180;
      const cardScale = 0.5 + (2.06 - 0.5) * (e * e);

      const A = responsiveScale;
      const frameRect = frameRef.current?.getBoundingClientRect();
      const frameCenterY = frameRect ? frameRect.top + frameRect.height / 2 : vh * 0.5;
      const introOff = (isMobileViewport ? 0.47 : 0.44) * vh - frameCenterY;
      const introOffset = introOff * (1 - e) + anchor * A;
      const introX = (isMobileViewport ? 48 : 140) * Math.sin(rollRad) * A;
      const centerScale = A;

      if (lensRef.current) {
        lensRef.current.style.perspective = `${(perspective * A).toFixed(2)}px`;
        lensRef.current.style.perspectiveOrigin = `50% calc(50% + ${(introOff * (1 - e)).toFixed(2)}px)`;
      }

      if (ringCenterRef.current) {
        ringCenterRef.current.style.transform = `translate3d(${introX.toFixed(2)}px, ${introOffset.toFixed(
          2
        )}px, 0px) rotateZ(${rollDeg.toFixed(3)}deg) rotateX(${tiltDeg.toFixed(
          3
        )}deg) scale3d(${centerScale.toFixed(4)}, ${centerScale.toFixed(4)}, ${A.toFixed(4)})`;
      }

      // 5. Place all 16 cards around cylinder + hover tilt springs
      const rotForSlots = s.introComplete ? s.g : 0;
      let frontBestIdx = 0;
      let frontBestAbsR = 999;

      for (let slot = 0; slot < TOTAL_SLOTS; slot++) {
        const cardEl = slotRefs.current[slot];
        const flipEl = flipRefs.current[slot];
        const tiltEl = tiltRefs.current[slot];
        if (!cardEl) continue;

        if (!s.introStarted && !s.prefersReducedMotion) {
          cardEl.style.opacity = '0';
          cardEl.style.visibility = 'hidden';
          cardEl.style.pointerEvents = 'none';
          cardEl.setAttribute('aria-hidden', 'true');
          continue;
        }

        // Exact slot angle in [-180, 180)
        const raw = (360 * slot) / TOTAL_SLOTS + rotForSlots + 180;
        const r = (((raw % 360) + 360) % 360) - 180;
        const absR = Math.abs(r);

        if (absR < frontBestAbsR) {
          frontBestAbsR = absR;
          frontBestIdx = slot;
        }

        const n = ((r + 180) % 360 + 360) % 360;
        const aNorm = n / 360;
        const iProg = clamp((f - 0.7 * aNorm) / 0.3, 0, 1);
        const sProg = 1 - Math.pow(1 - iProg, 3);
        const lDeg = -180 + n * sProg;
        const lRad = (lDeg * Math.PI) / 180;
        const effRadius = radius - (1 - sProg) * aNorm * 24;

        const x = -Math.sin(lRad) * effRadius;
        const z = -Math.cos(lRad) * effRadius;
        const appear = Math.min(1, 2.5 * iProg);

        // Smooth edge fade & camera culling so flank cards never loom oversized into edges
        const behindCamera = z * Math.cos(tiltRad) >= perspective - 70;
        const maxArc = 86;
        const outsideArc = s.introComplete && absR > maxArc;
        const arcFade = s.introComplete ? clamp(1 - (absR - 66) / (maxArc - 66), 0, 1) : 1;
        const visible = !behindCamera && !outsideArc && appear > 0.005 && arcFade > 0.01;
        const isInteractiveCard = s.introComplete && visible;

        cardEl.style.transform = `translate3d(${x.toFixed(2)}px, 0px, ${z.toFixed(
          2
        )}px) rotateY(${lDeg.toFixed(3)}deg) scale(${cardScale.toFixed(4)})`;
        cardEl.style.opacity = visible ? (appear * arcFade).toFixed(3) : '0';
        cardEl.style.visibility = visible ? 'visible' : 'hidden';
        cardEl.style.pointerEvents = isInteractiveCard ? 'auto' : 'none';
        cardEl.setAttribute('aria-hidden', isInteractiveCard ? 'false' : 'true');
        cardEl.style.zIndex = String(Math.round(3000 - z));

        // Flip face if past camera focal threshold
        if (flipEl) {
          const shouldFlip = z > (radius * radius) / perspective;
          flipEl.style.transform = shouldFlip ? 'rotateY(180deg)' : 'rotateY(0deg)';
        }

        // Per-card hover tilt spring (stiffness 180, damping 24)
        const ts = s.tilts[slot];
        if (tiltEl) {
          if (s.prefersReducedMotion) {
            ts.tx = 0;
            ts.ty = 0;
            ts.z = 0;
          } else {
            const fx = (ts.targetX - ts.tx) * 180 - ts.vx * 24;
            const fy = (ts.targetY - ts.ty) * 180 - ts.vy * 24;
            const fz = (ts.targetZ - ts.z) * 180 - ts.vz * 24;
            ts.vx += fx * dtSec;
            ts.vy += fy * dtSec;
            ts.vz += fz * dtSec;
            ts.tx += ts.vx * dtSec;
            ts.ty += ts.vy * dtSec;
            ts.z += ts.vz * dtSec;
          }
          tiltEl.style.transform = `translate3d(0px, 0px, ${ts.z.toFixed(2)}px) rotateX(${ts.tx.toFixed(
            2
          )}deg) rotateY(${ts.ty.toFixed(2)}deg)`;
        }
      }

      if (s.introComplete && !s.focusedInsideWall && Math.abs(s.gVel) < 2 && !s.isDragging) {
        setFocusedIndex((prev) => {
          if (prev !== frontBestIdx) {
            if (s.pendingSwipeAnnounce) {
              s.pendingSwipeAnnounce = false;
              setAnnounceMode('polite');
            } else {
              setAnnounceMode('off');
            }
            return frontBestIdx;
          }
          if (s.pendingSwipeAnnounce) {
            s.pendingSwipeAnnounce = false;
          }
          return prev;
        });
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const ensureLoopRunning = () => {
      if (!rafId && stateRef.current.isSectionVisible && !stateRef.current.isDocHidden) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const section = sectionRef.current;
    const visObserver = new IntersectionObserver(
      (entries) => {
        const visible = Boolean(entries[0]?.isIntersecting);
        stateRef.current.isSectionVisible = visible;
        if (visible) {
          ensureLoopRunning();
        } else if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.01 }
    );
    if (section) visObserver.observe(section);

    const handleVisibilityChange = () => {
      stateRef.current.isDocHidden = document.hidden;
      if (!document.hidden) {
        ensureLoopRunning();
      } else if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    ensureLoopRunning();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (loaderDoneTimer !== null) window.clearTimeout(loaderDoneTimer);
      if (expansionDoneTimer !== null) window.clearTimeout(expansionDoneTimer);
      visObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Pointer handlers on wall & cards
  const handleWallPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (!s.introComplete) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    s.isDragging = true;
    s.activePointerId = e.pointerId;
    s.dragType = e.pointerType === 'touch' ? 'touch' : 'mouse';
    s.dragLockedAxis = null;
    s.dragMoved = false;
    s.dragStartX = e.clientX;
    s.dragStartY = e.clientY;
    s.dragStartM = s.m;
    setIsDraggingUI(true);
  };

  const handleCardPointerMove = (slot: number, e: ReactPointerEvent<HTMLAnchorElement>) => {
    const s = stateRef.current;
    if (!s.introComplete || s.isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
    const ny = clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
    const ts = s.tilts[slot];
    ts.targetX = -20 * ny;
    ts.targetY = 24 * nx;
    ts.targetZ = 45;
  };

  const handleCardEnter = (slot: number) => {
    if (!stateRef.current.introComplete) return;
    stateRef.current.hoveredIdx = slot;
    setHoveredIndex(slot);
  };

  const handleCardLeave = (slot: number) => {
    const s = stateRef.current;
    s.hoveredIdx = null;
    const ts = s.tilts[slot];
    ts.targetX = 0;
    ts.targetY = 0;
    ts.targetZ = 0;
    setHoveredIndex(null);
  };

  const handleCardClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const s = stateRef.current;
    if (!s.introComplete || performance.now() - s.lastDragEndTime < 50 || s.dragMoved) {
      e.preventDefault();
    }
  };

  const rotateToSlot = useCallback((slotIdx: number, announce = true) => {
    const s = stateRef.current;
    const desiredMod = (-slotIdx * 360) / TOTAL_SLOTS;
    let delta = (desiredMod - s.m) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    s.m += delta;
    if (s.prefersReducedMotion) s.g = s.m;
    if (announce) setAnnounceMode('polite');
    setFocusedIndex(((slotIdx % TOTAL_SLOTS) + TOTAL_SLOTS) % TOTAL_SLOTS);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!stateRef.current.introComplete) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      rotateToSlot((focusedIndex + 1) % TOTAL_SLOTS, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      rotateToSlot((focusedIndex - 1 + TOTAL_SLOTS) % TOTAL_SLOTS, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      rotateToSlot(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      rotateToSlot(TOTAL_SLOTS - 1, true);
    }
  };

  const activeSite = siteForSlot(focusedIndex);
  const hundreds = Math.floor(displayPercent / 100);
  const tens = Math.floor((displayPercent % 100) / 10);
  const ones = displayPercent % 10;
  const digitsList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const isLoaderVisible = !prefersReducedMotion && loaderStage !== 'idle' && loaderStage !== 'done';
  const isRevealing = loaderStage === 'revealing';

  return (
    <section
      id={id}
      ref={sectionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Tesselo 3D Website Showcase. Swipe horizontally on touch screens, drag with mouse, or use arrow keys to browse projects."
      onKeyDown={handleKeyDown}
      className="ll-section-seam relative w-full bg-black select-none"
      style={{ height: prefersReducedMotion ? '100dvh' : '150dvh' }}
    >
      {/* Exclusive 100dvh Sticky Viewport Stage: transparent inner canvas over site #000 ground */}
      <div
        ref={frameRef}
        className="sticky top-0 flex h-dvh w-full items-center justify-center overflow-hidden bg-transparent"
      >
        <span className="sr-only" aria-live={announceMode} aria-atomic="true">
          No. {activeSite.number} of {TOTAL_SLOTS}: {activeSite.title}, {activeSite.category}
        </span>

        {/* Opening Loader Layer (transparent background, sits under forming ring at z-20) */}
        {isLoaderVisible && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden bg-transparent"
            style={{
              opacity: isRevealing ? 0 : 1,
              transition: 'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Top-left "Tesselo." masked letter-by-letter reveal */}
            <div
              className="absolute left-[4vw] top-[max(3.2vh,calc(env(safe-area-inset-top)+14px))] max-w-[92vw] font-heading font-normal text-[#EEF4F6]"
              style={{
                fontSize: 'clamp(36px, 6.8vw, 120px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                transform: isRevealing ? 'translate3d(0, -32px, 0) scale(0.92)' : 'translate3d(0, 0, 0) scale(1)',
                opacity: isRevealing ? 0 : 1,
                transition: 'transform 1150ms cubic-bezier(0.65, 0, 0.35, 1), opacity 750ms ease',
              }}
            >
              {WORDMARK_CHARS.map((char, idx) => (
                <span
                  key={`${char}-${idx}`}
                  className="inline-block overflow-hidden align-bottom py-[0.08em] -my-[0.08em]"
                >
                  <span
                    className="inline-block will-change-transform"
                    style={{
                      transform: introStarted
                        ? 'translate3d(0, 0%, 0) rotate(0deg)'
                        : 'translate3d(0, 105%, 0) rotate(8deg)',
                      transition: `transform 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${
                        0.08 + idx * 0.032
                      }s`,
                    }}
                  >
                    {char}
                  </span>
                </span>
              ))}
            </div>

            {/* Bottom-right "LOADING SITES" + 3-digit sliding odometer */}
            <div className="absolute bottom-[max(4vh,calc(env(safe-area-inset-bottom)+16px))] right-[5vw] flex flex-col items-end">
              <div className="min-h-[16px] font-space-mono text-[11px] tracking-[0.14em] uppercase text-[#B9CBD4] sm:text-[12px]">
                {typedCaption}
              </div>

              <div className="mt-2 overflow-hidden">
                <div
                  className="flex items-baseline font-space-mono leading-none tracking-[-0.09em] text-[#EEF4F6] tabular-nums"
                  style={{
                    fontSize: 'clamp(48px, 11vw, 160px)',
                    transform: isRevealing
                      ? 'translate3d(0, -108%, 0)'
                      : introStarted
                        ? 'translate3d(0, 0%, 0)'
                        : 'translate3d(0, 105%, 0)',
                    transition: isRevealing
                      ? 'transform 500ms cubic-bezier(0.6, 0, 0.8, 0.4)'
                      : 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1) 200ms',
                  }}
                >
                  {/* Hundreds digit (hidden until 100) */}
                  <span
                    className={`relative inline-block h-[1em] w-[0.65em] overflow-hidden transition-opacity duration-200 ${
                      hundreds > 0 ? 'opacity-100' : 'w-0 opacity-0'
                    }`}
                  >
                    <span
                      className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ transform: `translate3d(0, -${hundreds * 10}%, 0)` }}
                    >
                      {digitsList.map((d) => (
                        <span key={d} className="block h-[1em] leading-[1em]">
                          {d}
                        </span>
                      ))}
                    </span>
                  </span>

                  {/* Tens digit (hidden while < 10) */}
                  <span
                    className={`relative inline-block h-[1em] overflow-hidden transition-all duration-200 ${
                      displayPercent >= 10 ? 'w-[0.65em] opacity-100' : 'w-0 opacity-0'
                    }`}
                  >
                    <span
                      className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ transform: `translate3d(0, -${tens * 10}%, 0)` }}
                    >
                      {digitsList.map((d) => (
                        <span key={d} className="block h-[1em] leading-[1em]">
                          {d}
                        </span>
                      ))}
                    </span>
                  </span>

                  {/* Ones digit */}
                  <span className="relative inline-block h-[1em] w-[0.65em] overflow-hidden">
                    <span
                      className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ transform: `translate3d(0, -${ones * 10}%, 0)` }}
                    >
                      {digitsList.map((d) => (
                        <span key={d} className="block h-[1em] leading-[1em]">
                          {d}
                        </span>
                      ))}
                    </span>
                  </span>

                  <span className="ml-1 text-[0.34em] tracking-normal text-[#B9CBD4]">%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessible 44px Skip Intro button layered above stage and outside aria-hidden loader */}
        {isLoaderVisible && (
          <button
            type="button"
            aria-label="Skip showcase intro animation"
            onClick={(e) => {
              e.stopPropagation();
              skipIntro();
            }}
            style={{
              opacity: isRevealing ? 0 : 1,
              transition: 'opacity 500ms ease, border-color 200ms ease',
            }}
            className="pointer-events-auto touch-manipulation absolute bottom-[max(4vh,calc(env(safe-area-inset-bottom)+16px))] left-[4vw] z-40 inline-flex h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border border-[#EEF4F6]/25 bg-black/80 px-4 font-space-mono text-[11px] tracking-[0.12em] uppercase text-[#EEF4F6] hover:border-[#EEF4F6]/65 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Skip</span>
            <span aria-hidden="true">&#8599;</span>
          </button>
        )}

        {/* Transparent 3D Ring Wall & Lens Stage (z-30 so forming ring hovers above loader) */}
        <div
          onPointerDown={handleWallPointerDown}
          onFocusCapture={() => {
            stateRef.current.focusedInsideWall = true;
          }}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              stateRef.current.focusedInsideWall = false;
            }
          }}
          style={{ touchAction: 'pan-y' }}
          className={`relative z-30 h-full w-full overflow-hidden bg-transparent ${
            !introComplete ? 'cursor-default' : isDraggingUI ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Perspective Lens Container */}
          <div
            ref={lensRef}
            className="pointer-events-none absolute inset-x-0 -inset-y-[100vh] flex items-center justify-center"
            style={{
              perspective: '1040px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {/* Zero-size 3D Ring Center */}
            <div
              ref={ringCenterRef}
              className="preserve-3d relative h-0 w-0 will-change-transform"
            >
              {RIBBON_PROJECTS.map((_, slotIdx) => {
                const site = siteForSlot(slotIdx);
                const world = WORLD_META[site.world];
                const cardWidth = Math.round(160 * site.ratio);
                const isHovered = hoveredIndex === slotIdx && !isDraggingUI && introComplete;

                return (
                  <a
                    key={site.id}
                    ref={(el) => {
                      slotRefs.current[slotIdx] = el;
                    }}
                    data-ribbon-card="true"
                    role="group"
                    aria-roledescription="slide"
                    aria-hidden={!introComplete}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={introComplete && focusedIndex === slotIdx ? 0 : -1}
                    onPointerEnter={() => handleCardEnter(slotIdx)}
                    onPointerMove={(e) => handleCardPointerMove(slotIdx, e)}
                    onPointerLeave={() => handleCardLeave(slotIdx)}
                    onClick={handleCardClick}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (introComplete) {
                        rotateToSlot(slotIdx, true);
                        handleCardEnter(slotIdx);
                      }
                    }}
                    onBlur={() => handleCardLeave(slotIdx)}
                    aria-label={`No. ${site.number} of ${TOTAL_SLOTS}: ${site.title} (${world.label}, ${site.category}). Opens live preview in a new tab.`}
                    className="preserve-3d touch-manipulation group absolute block rounded-[16px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    style={{
                      width: `${cardWidth}px`,
                      height: '160px',
                      top: '-80px',
                      left: `${-cardWidth / 2}px`,
                      opacity: 0,
                    }}
                  >
                    {/* Flip wrapper (flips card face if past focal boundary) */}
                    <div
                      ref={(el) => {
                        flipRefs.current[slotIdx] = el;
                      }}
                      className="preserve-3d relative h-full w-full"
                    >
                      {/* Tilt wrapper driven by per-card hover springs */}
                      <div
                        ref={(el) => {
                          tiltRefs.current[slotIdx] = el;
                        }}
                        className="preserve-3d relative h-full w-full rounded-[16px] shadow-[0_18px_36px_-24px_rgba(0,0,0,0.45)]"
                        style={{
                          WebkitBoxReflect:
                            'below 10px linear-gradient(transparent 52%, rgba(255,255,255,0.28))',
                        }}
                      >
                        {/* Outer World-Colored Frame (inset -9px, 3px border, clip-path sweep in .55s on hover) */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-[9px] rounded-[24px] border-[3px]"
                          style={{
                            borderColor: world.color,
                            boxShadow: `0 40px 80px -30px ${world.color}`,
                            clipPath: isHovered
                              ? 'inset(0% 0% 0% 0% round 24px)'
                              : 'inset(0% 100% 0% 0% round 24px)',
                            transition: 'clip-path 550ms cubic-bezier(0.22, 1, 0.36, 1)',
                          }}
                        />

                        {/* LaunchLayer Card Face */}
                        <RibbonPreviewCard
                          project={site}
                          isHovered={isHovered}
                          onAssetReady={handleAssetSettled}
                        />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Screen-reader & keyboard-only focus-visible stepper (invisible to sighted pointer/touch users, always usable via VoiceOver/TalkBack/Switch Control) */}
          {introComplete && (
            <div className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:bottom-[max(4vh,calc(env(safe-area-inset-bottom)+16px))] focus-within:left-1/2 focus-within:z-50 focus-within:flex focus-within:-translate-x-1/2 focus-within:items-center focus-within:gap-3 focus-within:rounded-full focus-within:border focus-within:border-white/30 focus-within:bg-black/95 focus-within:px-4 focus-within:py-2 focus-within:shadow-2xl">
              <button
                type="button"
                aria-label="Previous showcase project"
                onClick={() => rotateToSlot((focusedIndex - 1 + TOTAL_SLOTS) % TOTAL_SLOTS, true)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/25 px-3 font-space-mono text-xs text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Prev
              </button>
              <span className="font-space-mono text-xs text-white/90">
                {activeSite.number} / {TOTAL_SLOTS}
              </span>
              <button
                type="button"
                aria-label="Next showcase project"
                onClick={() => rotateToSlot((focusedIndex + 1) % TOTAL_SLOTS, true)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/25 px-3 font-space-mono text-xs text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Next
              </button>
            </div>
          )}

          {/* Subtle Drag-to-Explore cue shown once ring entrance finishes */}
          {introComplete && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-[max(4.5vh,calc(env(safe-area-inset-bottom)+18px))] left-1/2 z-40 flex w-max max-w-[92vw] -translate-x-1/2 items-center justify-center gap-3 px-4 font-space-mono text-[11px] tracking-[0.22em] uppercase transition-all duration-300 ${
                isDraggingUI ? 'scale-95 text-white' : 'text-white/75'
              }`}
            >
              <span>&#8592;</span>
              <span>Drag to Explore</span>
              <span>&#8594;</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LaunchLayerRibbon;
