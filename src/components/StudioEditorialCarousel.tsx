import { useEffect, useRef } from 'react';
import { useScrollToTraverse } from '../hooks/useScrollToTraverse';
import type { EnquiryTopic } from './Navbar';
import { CoverSlide } from './editorial-carousel/slides/CoverSlide';
import { DesignBuildSlide } from './editorial-carousel/slides/DesignBuildSlide';
import { DirectionMoodboardSlide } from './editorial-carousel/slides/DirectionMoodboardSlide';
import { EndCardSlide } from './editorial-carousel/slides/EndCardSlide';
import { LaunchSlide } from './editorial-carousel/slides/LaunchSlide';
import { ProcessSlide } from './editorial-carousel/slides/ProcessSlide';
import { WorkPricingSlide } from './editorial-carousel/slides/WorkPricingSlide';

interface StudioEditorialCarouselProps {
  onOpenEnquiry: (topic?: EnquiryTopic) => void;
  requestedSlide?: { index: number; nonce: number } | null;
}

const SLIDE_TITLES = [
  'Introducing LaunchLayer',
  'How We Work: Four Steps, One Direction',
  'Design and Build',
  'Launch',
  'Plan Your Direction',
  'Work and Investment',
  'Let Us Build Something',
] as const;

const TOTAL_SLIDES = SLIDE_TITLES.length;

export function StudioEditorialCarousel({
  onOpenEnquiry,
  requestedSlide,
}: StudioEditorialCarouselProps) {
  const {
    sectionRef,
    trackRef,
    progressBarRef,
    activeSlide,
    prefersReducedMotion,
    announceMode,
    scrollToSlide,
    setDragging,
  } = useScrollToTraverse({ totalSlides: TOTAL_SLIDES });

  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lockedAxis: null as 'x' | 'y' | null,
  });

  useEffect(() => {
    if (!requestedSlide) return;
    scrollToSlide(requestedSlide.index);
  }, [requestedSlide, scrollToSlide]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (activeSlide < TOTAL_SLIDES - 1) scrollToSlide(activeSlide + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (activeSlide > 0) scrollToSlide(activeSlide - 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lockedAxis: null,
    };
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (!d.lockedAxis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      d.lockedAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      if (d.lockedAxis === 'y') {
        d.active = false;
        setDragging(false);
        return;
      }
    }

    const stepDx = e.clientX - d.lastX;
    d.lastX = e.clientX;
    window.scrollBy({ top: -stepDx * 1.45, behavior: 'instant' as ScrollBehavior });
  };

  const finishDrag = () => {
    dragRef.current.active = false;
    setDragging(false);
  };

  return (
    <section
      id="presentation"
      ref={sectionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="LaunchLayer Studio Presentation"
      className="ll-section-seam relative w-full bg-black"
      style={{ height: '420dvh' }}
    >
      {/* Screen-reader announcement region */}
      <div className="sr-only" aria-live={announceMode} aria-atomic="true">
        Slide {activeSlide + 1} of {TOTAL_SLIDES}: {SLIDE_TITLES[activeSlide]}
      </div>

      {/* Sticky Full-Viewport Container using 100% of horizontal and vertical space */}
      <div className="sticky top-0 flex h-dvh w-full flex-col overflow-hidden bg-black">
        {/* Full-Width, Full-Height Carousel Viewport (Arrow-Free) */}
        <div
          tabIndex={0}
          aria-label="Scroll vertically or use left and right keyboard keys to traverse studio slides."
          onKeyDown={handleKeyDown}
          onMouseLeave={finishDrag}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          className="relative min-h-0 w-full flex-1 overflow-hidden bg-black touch-pan-y select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          {/* Horizontally Translated 7-Slide Track driven by useScrollToTraverse */}
          <div ref={trackRef} className="flex h-full w-full will-change-transform">
            <div
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`1 of ${TOTAL_SLIDES}: ${SLIDE_TITLES[0]}`}
              aria-hidden={activeSlide !== 0}
              className="h-full w-full shrink-0"
            >
              <CoverSlide
                isActive={activeSlide === 0}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            <div
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`2 of ${TOTAL_SLIDES}: ${SLIDE_TITLES[1]}`}
              aria-hidden={activeSlide !== 1}
              className="h-full w-full shrink-0"
            >
              <ProcessSlide
                isActive={activeSlide === 1}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            <div
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`3 of ${TOTAL_SLIDES}: ${SLIDE_TITLES[2]}`}
              aria-hidden={activeSlide !== 2}
              className="h-full w-full shrink-0"
            >
              <DesignBuildSlide isActive={activeSlide === 2} />
            </div>

            <div
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`4 of ${TOTAL_SLIDES}: ${SLIDE_TITLES[3]}`}
              aria-hidden={activeSlide !== 3}
              className="h-full w-full shrink-0"
            >
              <LaunchSlide
                isActive={activeSlide === 3}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            <div
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`5 of ${TOTAL_SLIDES}: ${SLIDE_TITLES[4]}`}
              aria-hidden={activeSlide !== 4}
              className="h-full w-full shrink-0"
            >
              <DirectionMoodboardSlide isActive={activeSlide === 4} />
            </div>

            <div
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`6 of ${TOTAL_SLIDES}: ${SLIDE_TITLES[5]}`}
              aria-hidden={activeSlide !== 5}
              className="h-full w-full shrink-0"
            >
              <WorkPricingSlide
                isActive={activeSlide === 5}
                onSelectPricing={() => onOpenEnquiry('Pricing')}
              />
            </div>

            <div
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`7 of ${TOTAL_SLIDES}: ${SLIDE_TITLES[6]}`}
              aria-hidden={activeSlide !== 6}
              className="h-full w-full shrink-0"
            >
              <EndCardSlide
                isActive={activeSlide === 6}
                onStartConversation={() => onOpenEnquiry('General')}
              />
            </div>
          </div>
        </div>

        {/* Full-Width Integrated Bottom Progress Rail & Seven Navigation Dots */}
        <div className="flex w-full shrink-0 flex-col gap-1 border-t border-white/15 bg-black px-4 py-2 sm:px-6 md:px-10 lg:px-14">
          <div className="relative h-px w-full overflow-hidden bg-white/15">
            <div
              ref={progressBarRef}
              className="h-[1.5px] w-full origin-left bg-white shadow-[0_0_12px_rgba(255,255,255,0.45)] will-change-transform"
              style={{ transform: `scaleX(${(1 / TOTAL_SLIDES).toFixed(4)})` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-space-mono text-[12px] tracking-[0.1em] text-white/85 tabular-nums shrink-0">
              0{activeSlide + 1} / 0{TOTAL_SLIDES}
            </span>

            <div className="flex items-center gap-0.5 sm:gap-1" role="tablist" aria-label="Choose a slide">
              {SLIDE_TITLES.map((title, idx) => {
                const active = activeSlide === idx;
                return (
                  <button
                    key={title}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Slide ${idx + 1}: ${title}`}
                    onClick={() => scrollToSlide(idx)}
                    className="flex h-11 min-w-[34px] items-center justify-center cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-w-[44px]"
                  >
                    <span
                      aria-hidden="true"
                      className={`block rounded-full transition-all duration-200 ${
                        active
                          ? 'h-2 w-5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.45)]'
                          : 'h-2 w-2 bg-white/40 hover:bg-white/80'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <span className="hidden sm:inline font-space-mono text-[11.5px] tracking-[0.12em] uppercase text-white/65 shrink-0">
              Scroll to traverse
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
