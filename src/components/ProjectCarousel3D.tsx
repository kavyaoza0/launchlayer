import { useEffect, useRef, useState } from 'react';
import { SHOWCASE_PROJECTS } from './carousel/projectData';
import { ProjectPreviewCard } from './carousel/ProjectPreviewCard';

const DEPTH_LAYERS = [-2, -4, -6, -8, -10, -12, -14];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function computeDimensions(vw: number, vh: number) {
  let width: number;
  let height: number;
  let radius: number;

  if (vw < 640) {
    width = clamp(vw * 0.84, 270, 360);
    height = clamp(vh * 0.46, 250, 330);
    radius = Math.max(width * 1.32, 390);
  } else if (vw < 1024) {
    width = clamp(vw * 0.62, 400, 520);
    height = clamp(vh * 0.52, 310, 390);
    radius = Math.max(width * 1.4, 620);
  } else {
    width = clamp(vw * 0.43, 480, 660);
    height = clamp(vh * 0.58, 340, 470);
    radius = Math.max(width * 1.44, vw * 0.52);
  }

  return { width: Math.round(width), height: Math.round(height), radius: Math.round(radius) };
}

export function ProjectCarousel3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reflectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isPaused, setIsPaused] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const [dims, setDims] = useState(() =>
    typeof window !== 'undefined'
      ? computeDimensions(window.innerWidth, window.innerHeight)
      : { width: 580, height: 420, radius: 820 }
  );

  // Mutable animation state kept outside React state to ensure 60fps zero-rerender loop
  const stateRef = useRef({
    progress: 0,
    targetSnapOffset: 0,
    velocity: 0,
    autoSpeed: 0.14,
    isDragging: false,
    dragStartX: 0,
    dragMoved: false,
    lastDragX: 0,
    isHoveringCard: false,
    isPaused: false,
    pointerTargetX: 0,
    pointerTargetY: 0,
    tiltX: 0,
    tiltY: 0,
    radius: dims.radius,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    stateRef.current.radius = dims.radius;
  }, [dims.radius]);

  useEffect(() => {
    stateRef.current.isPaused = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const handleResize = () => {
      setDims(computeDimensions(window.innerWidth, window.innerHeight));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    stateRef.current.prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      stateRef.current.prefersReducedMotion = e.matches;
    };
    motionQuery.addEventListener('change', handleMotionChange);

    const total = SHOWCASE_PROJECTS.length;
    let rafId = 0;
    let lastTime = performance.now();

    const updateTransforms = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const s = stateRef.current;

      if (!s.isDragging) {
        const speedMultiplier =
          s.prefersReducedMotion || s.isPaused ? 0 : s.isHoveringCard ? 0.25 : 1;
        s.progress += s.autoSpeed * speedMultiplier * dt + s.velocity;
        s.velocity *= 0.92;
        if (Math.abs(s.velocity) < 0.0001) s.velocity = 0;

        if (Math.abs(s.targetSnapOffset) > 0.0005) {
          const step = s.targetSnapOffset * 0.12;
          s.progress += step;
          s.targetSnapOffset -= step;
        } else {
          s.targetSnapOffset = 0;
        }
      }

      const damping = s.prefersReducedMotion ? 0 : 0.075;
      s.tiltX += (s.pointerTargetX - s.tiltX) * damping;
      s.tiltY += (s.pointerTargetY - s.tiltY) * damping;

      const angleStep = (Math.PI * 2) / total;

      for (let i = 0; i < total; i++) {
        const cardEl = cardRefs.current[i];
        const reflEl = reflectionRefs.current[i];
        if (!cardEl) continue;

        let offset = (((i - s.progress) % total) + total) % total;
        if (offset > total / 2) offset -= total;

        const absOffset = Math.abs(offset);
        const theta = offset * angleStep * 0.72;

        const tx = Math.sin(theta) * s.radius;
        const tz = (Math.cos(theta) - 1) * s.radius * 0.9;
        const baseRotY = -(theta * 180) / Math.PI;

        const centerFocus = 1 - smoothstep(0.0, 1.35, absOffset);
        const visibility = 1 - smoothstep(1.3, 2.45, absOffset);
        const scale = 0.8 + 0.2 * centerFocus;

        const tiltWeight = 0.3 + 0.7 * centerFocus;
        const parallaxRotY = s.tiltX * 9.5 * tiltWeight;
        const parallaxRotX = s.tiltY * -6.5 * tiltWeight;

        const zIndex = Math.round((1 - absOffset / total) * 100);

        cardEl.style.transform = `translate3d(${tx.toFixed(2)}px, 0px, ${tz.toFixed(
          2
        )}px) rotateY(${(baseRotY + parallaxRotY).toFixed(2)}deg) rotateX(${parallaxRotX.toFixed(
          2
        )}deg) scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1)`;
        cardEl.style.opacity = visibility.toFixed(3);
        cardEl.style.zIndex = String(zIndex);
        cardEl.style.pointerEvents = visibility > 0.22 ? 'auto' : 'none';

        if (reflEl) {
          reflEl.style.opacity = (visibility * 0.24 * centerFocus).toFixed(3);
        }
      }

      rafId = window.requestAnimationFrame(updateTransforms);
    };

    rafId = window.requestAnimationFrame(updateTransforms);

    return () => {
      window.cancelAnimationFrame(rafId);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const snapToIndex = (index: number) => {
    const total = SHOWCASE_PROJECTS.length;
    const normalized = ((index % total) + total) % total;
    let offset = (((normalized - stateRef.current.progress) % total) + total) % total;
    if (offset > total / 2) offset -= total;
    stateRef.current.targetSnapOffset = offset;
    setFocusedIndex(normalized);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      snapToIndex(focusedIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      snapToIndex(focusedIndex - 1);
    } else if (e.key === ' ' || e.key === 'Enter') {
      if ((e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    stateRef.current.pointerTargetX = clamp(nx, -1, 1);
    stateRef.current.pointerTargetY = clamp(ny, -1, 1);

    if (stateRef.current.isDragging) {
      const dx = e.clientX - stateRef.current.lastDragX;
      if (Math.abs(e.clientX - stateRef.current.dragStartX) > 6) {
        stateRef.current.dragMoved = true;
      }
      const deltaProgress = -dx / Math.max(dims.width * 0.9, 260);
      stateRef.current.progress += deltaProgress;
      stateRef.current.velocity = deltaProgress * 0.45;
      stateRef.current.lastDragX = e.clientX;
    }
  };

  const handleMouseLeave = () => {
    stateRef.current.pointerTargetX = 0;
    stateRef.current.pointerTargetY = 0;
    stateRef.current.isDragging = false;
    stateRef.current.isHoveringCard = false;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stateRef.current.isDragging = true;
    stateRef.current.dragStartX = e.clientX;
    stateRef.current.lastDragX = e.clientX;
    stateRef.current.dragMoved = false;
    stateRef.current.targetSnapOffset = 0;
  };

  const handlePointerUp = () => {
    stateRef.current.isDragging = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!stateRef.current.isDragging || e.touches.length === 0) return;
    const touchX = e.touches[0].clientX;
    const dx = touchX - stateRef.current.lastDragX;
    if (Math.abs(touchX - stateRef.current.dragStartX) > 6) {
      stateRef.current.dragMoved = true;
    }
    const deltaProgress = -dx / Math.max(dims.width * 0.85, 220);
    stateRef.current.progress += deltaProgress;
    stateRef.current.velocity = deltaProgress * 0.5;
    stateRef.current.lastDragX = touchX;
  };

  const handleCardClick = (index: number) => {
    if (stateRef.current.dragMoved) return;
    snapToIndex(index);
  };

  const activeProject = SHOWCASE_PROJECTS[focusedIndex];

  return (
    <section
      id="work"
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected Website Projects"
      tabIndex={0}
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchMove={handleTouchMove}
      className="ll-section-seam relative flex h-[min(86dvh,760px)] min-h-[540px] w-full items-center justify-center overflow-hidden bg-[#040406] select-none cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F0ECE7]/60"
    >
      {/* Screen-reader live status & keyboard-only focusable controls (invisible unless keyboard-focused) */}
      <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:bottom-6 focus-within:left-6 focus-within:z-50 focus-within:flex focus-within:items-center focus-within:gap-3 focus-within:border focus-within:border-[#F0ECE7]/30 focus-within:bg-[#050505] focus-within:p-3">
        <span aria-live="polite" className="text-xs text-[#F0ECE7]">
          Project {focusedIndex + 1} of {SHOWCASE_PROJECTS.length}: {activeProject.title} —{' '}
          {activeProject.category}
        </span>
        <button
          type="button"
          onClick={() => snapToIndex(focusedIndex - 1)}
          className="min-h-[40px] border border-[#F0ECE7]/30 px-3 text-xs text-[#F0ECE7] focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
        >
          Previous project
        </button>
        <button
          type="button"
          onClick={() => snapToIndex(focusedIndex + 1)}
          className="min-h-[40px] border border-[#F0ECE7]/30 px-3 text-xs text-[#F0ECE7] focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
        >
          Next project
        </button>
        <button
          type="button"
          aria-pressed={isPaused}
          onClick={() => setIsPaused((prev) => !prev)}
          className="min-h-[40px] border border-[#F0ECE7]/30 px-3 text-xs text-[#F0ECE7] focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
        >
          {isPaused ? 'Resume motion' : 'Pause motion'}
        </button>
      </div>

      {/* Soft Ambient Warm Horizon Atmosphere behind focal carousel stage */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[460px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(159,48,53,0.16)_0%,rgba(217,155,82,0.08)_42%,transparent_74%)] blur-[84px]" />
      </div>

      {/* 3D Perspective Stage */}
      <div className="carousel-stage-3d relative flex h-full w-full items-center justify-center">
        <div
          className="preserve-3d relative flex items-center justify-center"
          style={{ width: dims.width, height: dims.height }}
        >
          {SHOWCASE_PROJECTS.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${project.title}, ${project.category}`}
              onMouseEnter={() => {
                stateRef.current.isHoveringCard = true;
              }}
              onMouseLeave={() => {
                stateRef.current.isHoveringCard = false;
              }}
              onClick={() => handleCardClick(index)}
              className="preserve-3d absolute inset-0 will-change-transform"
              style={{ width: dims.width, height: dims.height }}
            >
              {/* Volumetric 3D depth stack */}
              {DEPTH_LAYERS.map((zDepth, layerIdx) => (
                <div
                  key={zDepth}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border bg-[#09090B]"
                  style={{
                    transform: `translateZ(${zDepth}px)`,
                    borderColor: `rgba(217, 155, 82, ${(0.14 - layerIdx * 0.015).toFixed(3)})`,
                  }}
                />
              ))}

              {/* Back plate */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border border-[#9F3035]/25 bg-[#050507]"
                style={{ transform: 'translateZ(-16px) rotateY(180deg)' }}
              />

              {/* Front Website Showcase Surface */}
              <div
                className="relative h-full w-full overflow-hidden border border-[#D99B52]/28 bg-[#0A0A0C] shadow-[0_32px_90px_rgba(0,0,0,0.9),0_0_42px_rgba(159,48,53,0.16)]"
                style={{ transform: 'translateZ(0px)' }}
              >
                <ProjectPreviewCard project={project} />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(132deg,rgba(217,155,82,0.075)_0%,rgba(159,48,53,0.03)_24%,rgba(255,255,255,0)_48%)]"
                />
              </div>

              {/* Subtle warm floor reflection beneath the slab */}
              <div
                ref={(el) => {
                  reflectionRefs.current[index] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 -bottom-12 h-11 bg-[radial-gradient(ellipse_at_center,rgba(217,155,82,0.18)_0%,rgba(159,48,53,0.10)_42%,rgba(0,0,0,0)_74%)] blur-md"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
