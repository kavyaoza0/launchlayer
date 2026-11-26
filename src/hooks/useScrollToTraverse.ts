import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollToTraverseOptions {
  totalSlides: number;
  initialSlide?: number;
  onProgress?: (progress: number) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function useScrollToTraverse({
  totalSlides,
  initialSlide = 0,
  onProgress,
}: UseScrollToTraverseOptions) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const activeSlideRef = useRef(initialSlide);
  const targetProgressRef = useRef(initialSlide);
  const currentProgressRef = useRef(initialSlide);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const rafRef = useRef(0);
  const scrollAnimRafRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  const [activeSlide, setActiveSlide] = useState(initialSlide);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [announceMode, setAnnounceMode] = useState<'off' | 'polite'>('off');

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

  const cancelProgrammaticScroll = useCallback(() => {
    if (scrollAnimRafRef.current) {
      window.cancelAnimationFrame(scrollAnimRafRef.current);
      scrollAnimRafRef.current = 0;
    }
  }, []);

  // Custom quintic/cubic-eased rAF vertical glide so button/tab/arrow transitions never fight browser smooth scroll
  const scrollToSlide = useCallback(
    (nextIndex: number, announce = true) => {
      const clamped = clamp(nextIndex, 0, totalSlides - 1);
      const section = sectionRef.current;
      if (!section) return;

      if (announce) setAnnounceMode('polite');
      cancelProgrammaticScroll();

      const rect = section.getBoundingClientRect();
      const sectionTopDoc = window.scrollY + rect.top;
      const totalScrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      const targetFraction = clamped / Math.max(totalSlides - 1, 1);
      const targetY = sectionTopDoc + targetFraction * totalScrollable;

      if (prefersReducedMotionRef.current) {
        window.scrollTo({ top: targetY, behavior: 'auto' });
        return;
      }

      const startY = window.scrollY;
      const deltaY = targetY - startY;
      if (Math.abs(deltaY) < 1) return;

      const durationMs = clamp(Math.abs(deltaY) * 0.35, 360, 620);
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = clamp(elapsed / durationMs, 0, 1);
        const eased = easeInOutCubic(t);
        window.scrollTo({ top: startY + deltaY * eased, behavior: 'auto' });
        if (t < 1) {
          scrollAnimRafRef.current = window.requestAnimationFrame(step);
        } else {
          scrollAnimRafRef.current = 0;
        }
      };

      scrollAnimRafRef.current = window.requestAnimationFrame(step);
    },
    [cancelProgrammaticScroll, totalSlides]
  );

  const setDragging = useCallback(
    (dragging: boolean) => {
      isDraggingRef.current = dragging;
      if (dragging) cancelProgrammaticScroll();
    },
    [cancelProgrammaticScroll]
  );

  useEffect(() => {
    const applyVisuals = (progress: number) => {
      if (onProgressRef.current) {
        onProgressRef.current(progress);
      } else if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${(-progress * 100).toFixed(4)}%, 0, 0)`;
      }

      if (progressBarRef.current) {
        const scaleX = (progress + 1) / totalSlides;
        progressBarRef.current.style.transform = `scaleX(${scaleX.toFixed(4)})`;
      }
    };

    const renderLoop = (now: number) => {
      rafRef.current = 0;

      const dtSec = lastFrameTimeRef.current
        ? clamp((now - lastFrameTimeRef.current) / 1000, 0.001, 0.05)
        : 1 / 60;
      lastFrameTimeRef.current = now;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Framerate-independent exponential smoothing (~120Hz/60Hz consistent silky damping)
      const smoothingRate = isDraggingRef.current ? 20 : 12.5;
      const lerpAlpha = 1 - Math.exp(-smoothingRate * dtSec);

      const next =
        prefersReducedMotionRef.current || Math.abs(diff) < 0.0004
          ? target
          : current + diff * lerpAlpha;

      currentProgressRef.current = next;
      applyVisuals(next);

      // Gentle hysteresis prevents rapid tab flipping right around the 0.5 boundary
      const prevActive = activeSlideRef.current;
      let nextActive = prevActive;
      const deltaFromPrev = next - prevActive;
      if (deltaFromPrev > 0.54) {
        nextActive = clamp(Math.round(next), 0, totalSlides - 1);
      } else if (deltaFromPrev < -0.54) {
        nextActive = clamp(Math.round(next), 0, totalSlides - 1);
      } else if (Math.abs(diff) < 0.002) {
        nextActive = clamp(Math.round(next), 0, totalSlides - 1);
      }

      if (nextActive !== prevActive) {
        activeSlideRef.current = nextActive;
        setAnnounceMode('off');
        setActiveSlide(nextActive);
      }

      if (Math.abs(target - next) >= 0.0004) {
        rafRef.current = window.requestAnimationFrame(renderLoop);
      } else {
        lastFrameTimeRef.current = 0;
      }
    };

    const scheduleRender = () => {
      if (!rafRef.current) {
        lastFrameTimeRef.current = 0;
        rafRef.current = window.requestAnimationFrame(renderLoop);
      }
    };

    const handleScrollUpdate = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const totalScrollable = Math.max(rect.height - vh, 1);
      const u = clamp(-rect.top / totalScrollable, 0, 1);

      // Continuous linear 1:1 scroll-to-progress mapping (zero dead-zones or abrupt acceleration spikes)
      targetProgressRef.current = u * Math.max(totalSlides - 1, 1);
      scheduleRender();
    };

    // Cancel any programmatic click-scroll the instant the user wheels or touches manually
    const onManualInput = () => {
      cancelProgrammaticScroll();
    };

    // Prime initial geometry synchronously without waiting for first scroll
    const section = sectionRef.current;
    if (section) {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const u = clamp(-rect.top / Math.max(rect.height - vh, 1), 0, 1);
      const initial = u * Math.max(totalSlides - 1, 1);
      targetProgressRef.current = initial;
      currentProgressRef.current = initial;
      applyVisuals(initial);
    }

    window.addEventListener('scroll', handleScrollUpdate, { passive: true });
    window.addEventListener('wheel', onManualInput, { passive: true });
    window.addEventListener('touchstart', onManualInput, { passive: true });
    window.addEventListener('resize', handleScrollUpdate, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && section
        ? new ResizeObserver(() => handleScrollUpdate())
        : null;
    if (resizeObserver && section) {
      resizeObserver.observe(section);
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      cancelProgrammaticScroll();
      window.removeEventListener('scroll', handleScrollUpdate);
      window.removeEventListener('wheel', onManualInput);
      window.removeEventListener('touchstart', onManualInput);
      window.removeEventListener('resize', handleScrollUpdate);
      resizeObserver?.disconnect();
    };
  }, [cancelProgrammaticScroll, totalSlides]);

  return {
    sectionRef,
    trackRef,
    progressBarRef,
    currentProgressRef,
    activeSlide,
    prefersReducedMotion,
    announceMode,
    scrollToSlide,
    setDragging,
  };
}
