import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollToTraverseOptions {
  totalSlides: number;
  initialSlide?: number;
}

interface SlideSegment {
  holdStart: number;
  holdEnd: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * C2-continuous quintic smootherstep easing for zero-jerk entry/exit
 * between flat viewing plateaus and horizontal slide transitions.
 */
function smootherstep01(t: number): number {
  const c = clamp(t, 0, 1);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function buildSlideSegments(totalSlides: number): SlideSegment[] {
  const holds = Array.from({ length: totalSlides }, (_, idx) => {
    if (idx === 0) return 0.115; // Generous opening plateau for CoverSlide ("A better way to be seen")
    if (idx === totalSlides - 1) return 0.09; // Clean exit plateau on final slide
    return 0.075;
  });

  const totalHold = holds.reduce((sum, h) => sum + h, 0);
  const trans = (1 - totalHold) / Math.max(totalSlides - 1, 1);

  const segments: SlideSegment[] = [];
  let cursor = 0;

  for (let i = 0; i < totalSlides; i++) {
    const holdStart = cursor;
    const holdEnd = i === totalSlides - 1 ? 1 : holdStart + holds[i];
    segments.push({ holdStart, holdEnd });
    cursor = holdEnd + trans;
  }

  return segments;
}

/**
 * Custom scroll-to-traverse hook driven by a high-precision performance.now()
 * scroll velocity listener and non-linear C2 plateau + transition mapping.
 */
export function useScrollToTraverse({
  totalSlides,
  initialSlide = 0,
}: UseScrollToTraverseOptions) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const activeSlideRef = useRef(initialSlide);
  const targetProgressRef = useRef(initialSlide);
  const currentProgressRef = useRef(initialSlide);
  const rafRef = useRef(0);
  const snapTimerRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const isDraggingRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // High-precision scroll velocity state (px/ms & normalized progress/sec)
  const velocityTrackerRef = useRef({
    lastY: typeof window !== 'undefined' ? window.scrollY : 0,
    lastTime: typeof performance !== 'undefined' ? performance.now() : 0,
    smoothedPxPerMs: 0,
  });

  const segmentsRef = useRef<SlideSegment[]>(buildSlideSegments(totalSlides));

  const [activeSlide, setActiveSlide] = useState(initialSlide);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [announceMode, setAnnounceMode] = useState<'off' | 'polite'>('off');

  useEffect(() => {
    segmentsRef.current = buildSlideSegments(totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    prefersReducedMotionRef.current = mq.matches;

    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      prefersReducedMotionRef.current = e.matches;
    };

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const mapScrollFractionToProgress = useCallback(
    (u: number): number => {
      const clamped = clamp(u, 0, 1);
      const segments = segmentsRef.current;

      for (let i = 0; i < totalSlides; i++) {
        const seg = segments[i];
        if (clamped <= seg.holdEnd) {
          return i;
        }
        if (i < totalSlides - 1) {
          const nextSeg = segments[i + 1];
          if (clamped < nextSeg.holdStart) {
            const localT =
              (clamped - seg.holdEnd) / Math.max(nextSeg.holdStart - seg.holdEnd, 1e-6);
            return i + smootherstep01(localT);
          }
        }
      }

      return totalSlides - 1;
    },
    [totalSlides]
  );

  const getPlateauCenterFraction = useCallback(
    (index: number): number => {
      const clamped = clamp(index, 0, totalSlides - 1);
      if (clamped === 0) return 0;
      if (clamped === totalSlides - 1) return 1;
      const seg = segmentsRef.current[clamped];
      return (seg.holdStart + seg.holdEnd) / 2;
    },
    [totalSlides]
  );

  const scrollToSlide = useCallback(
    (nextIndex: number, announce = true) => {
      const clamped = clamp(nextIndex, 0, totalSlides - 1);
      const section = sectionRef.current;
      if (!section) return;

      if (announce) setAnnounceMode('polite');
      const rect = section.getBoundingClientRect();
      const sectionTopDoc = window.scrollY + rect.top;
      const totalScrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      const targetFraction = getPlateauCenterFraction(clamped);
      const targetScrollY = sectionTopDoc + targetFraction * totalScrollable;

      isProgrammaticScrollRef.current = true;
      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 480);

      window.scrollTo({
        top: targetScrollY,
        behavior: prefersReducedMotionRef.current ? 'auto' : 'smooth',
      });
    },
    [getPlateauCenterFraction, totalSlides]
  );

  const setDragging = useCallback((dragging: boolean) => {
    isDraggingRef.current = dragging;
  }, []);

  useEffect(() => {
    const renderLoop = () => {
      rafRef.current = 0;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Velocity-adaptive interpolation: responsive during fast flicks, velvety at rest
      const speedPxPerMs = Math.abs(velocityTrackerRef.current.smoothedPxPerMs);
      const adaptiveFactor = clamp(0.18 + speedPxPerMs * 0.06, 0.18, 0.42);

      const next =
        prefersReducedMotionRef.current || Math.abs(diff) < 0.0006
          ? target
          : current + diff * adaptiveFactor;

      currentProgressRef.current = next;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${(-next * 100).toFixed(4)}%, 0, 0)`;
      }

      if (progressBarRef.current) {
        const scaleX = (next + 1) / totalSlides;
        progressBarRef.current.style.transform = `scaleX(${scaleX.toFixed(4)})`;
      }

      const nextActive = clamp(Math.round(next), 0, totalSlides - 1);
      if (nextActive !== activeSlideRef.current) {
        activeSlideRef.current = nextActive;
        setAnnounceMode('off');
        setActiveSlide(nextActive);
      }

      // Decay smoothed scroll velocity cleanly between frames
      velocityTrackerRef.current.smoothedPxPerMs *= 0.85;
      if (Math.abs(velocityTrackerRef.current.smoothedPxPerMs) < 0.002) {
        velocityTrackerRef.current.smoothedPxPerMs = 0;
      }

      if (Math.abs(target - next) >= 0.0006) {
        rafRef.current = window.requestAnimationFrame(renderLoop);
      }
    };

    const scheduleRender = () => {
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(renderLoop);
      }
    };

    const handleScrollUpdate = () => {
      const section = sectionRef.current;
      if (!section) return;

      // Sample high-precision scroll velocity using monotonic clock
      const now = performance.now();
      const scrollY = window.scrollY;
      const vt = velocityTrackerRef.current;
      const dt = clamp(now - vt.lastTime, 4, 64);
      const dy = scrollY - vt.lastY;
      const instantPxPerMs = dy / dt;

      vt.smoothedPxPerMs = vt.smoothedPxPerMs * 0.65 + instantPxPerMs * 0.35;
      vt.lastY = scrollY;
      vt.lastTime = now;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const totalScrollable = Math.max(rect.height - vh, 1);
      const u = clamp(-rect.top / totalScrollable, 0, 1);
      const mappedProgress = mapScrollFractionToProgress(u);

      targetProgressRef.current = mappedProgress;
      scheduleRender();

      if (snapTimerRef.current) {
        window.clearTimeout(snapTimerRef.current);
        snapTimerRef.current = 0;
      }

      // Idle velocity-aware magnetic settle when pinned inside a transition ramp
      const isPinned = rect.top <= 0 && rect.bottom >= vh;
      const nearestIndex = clamp(Math.round(mappedProgress), 0, totalSlides - 1);
      const distanceFromInteger = Math.abs(mappedProgress - nearestIndex);

      if (
        isPinned &&
        !isDraggingRef.current &&
        !isProgrammaticScrollRef.current &&
        !prefersReducedMotionRef.current &&
        distanceFromInteger > 0.015
      ) {
        const settleDelay = Math.abs(vt.smoothedPxPerMs) > 1.2 ? 210 : 150;
        snapTimerRef.current = window.setTimeout(() => {
          snapTimerRef.current = 0;
          const liveSection = sectionRef.current;
          if (!liveSection || isDraggingRef.current) return;
          const liveRect = liveSection.getBoundingClientRect();
          const liveVh = window.innerHeight || 1;
          if (liveRect.top <= 0 && liveRect.bottom >= liveVh) {
            const liveU = clamp(-liveRect.top / Math.max(liveRect.height - liveVh, 1), 0, 1);
            const liveProgress = mapScrollFractionToProgress(liveU);
            const targetIdx = clamp(Math.round(liveProgress), 0, totalSlides - 1);
            if (Math.abs(liveProgress - targetIdx) > 0.015) {
              scrollToSlide(targetIdx, false);
            }
          }
        }, settleDelay);
      }
    };

    handleScrollUpdate();

    window.addEventListener('scroll', handleScrollUpdate, { passive: true });
    document.addEventListener('scroll', handleScrollUpdate, { passive: true, capture: true });
    window.addEventListener('resize', handleScrollUpdate, { passive: true });

    const section = sectionRef.current;
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && section
        ? new ResizeObserver(() => handleScrollUpdate())
        : null;
    if (resizeObserver && section) {
      resizeObserver.observe(section);
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
      window.removeEventListener('scroll', handleScrollUpdate);
      document.removeEventListener('scroll', handleScrollUpdate, { capture: true });
      window.removeEventListener('resize', handleScrollUpdate);
      resizeObserver?.disconnect();
    };
  }, [mapScrollFractionToProgress, scrollToSlide, totalSlides]);

  return {
    sectionRef,
    trackRef,
    progressBarRef,
    activeSlide,
    prefersReducedMotion,
    announceMode,
    scrollToSlide,
    setDragging,
  };
}
