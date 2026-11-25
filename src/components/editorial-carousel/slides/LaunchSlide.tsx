import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { WebsiteMockup } from '../WebsiteMockups';

interface LaunchSlideProps {
  isActive: boolean;
  prefersReducedMotion: boolean;
}

export function LaunchSlide({ isActive, prefersReducedMotion }: LaunchSlideProps) {
  const [launched, setLaunched] = useState(false);
  const [cursorPressed, setCursorPressed] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setLaunched(false);
      setCursorPressed(false);
      return;
    }

    if (prefersReducedMotion) {
      setCursorPressed(true);
      setLaunched(true);
      return;
    }

    setLaunched(false);
    setCursorPressed(false);

    const t1 = window.setTimeout(() => setCursorPressed(true), 320);
    const t2 = window.setTimeout(() => setLaunched(true), 600);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [isActive, prefersReducedMotion]);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black p-4 font-body text-white sm:p-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Soft monochrome radial aura behind showcase window */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_74%)] blur-[96px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-2 border-b border-white/15 pb-3.5">
        <div className="flex items-center justify-between text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
          <span className="text-white">04 · LAUNCH</span>
          <span>REFINED &amp; VERIFIED</span>
        </div>
        <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-end">
          <h2 className="font-heading text-[clamp(1.75rem,min(3.4vw,5.2dvh),3rem)] leading-[0.96] tracking-tight text-white">
            Then, it&apos;s out in the <span className="italic">world</span>.
          </h2>
          <p className="max-w-[48ch] text-[13px] font-normal leading-[1.55] text-white/80 sm:text-[14px]">
            After refinement, testing and final checks, your website is ready to meet the people it
            was built for.
          </p>
        </div>
      </div>

      {/* Centerpiece: Large Featured Website Preview */}
      <div className="relative z-10 my-auto flex flex-1 flex-col justify-center py-3 sm:py-4">
        <div
          className={`relative flex h-full max-h-[54dvh] w-full flex-col overflow-hidden rounded-xl border bg-[#0a0a0a] transition-all duration-500 ${
            launched ? 'll-glow-border-strong' : 'll-glow-border'
          }`}
        >
          {/* Browser Chrome + Launch Control */}
          <div className="relative flex items-center justify-between border-b border-white/15 bg-[#111111] px-4 py-2 sm:px-5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-white/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>

            {/* Interactive Launch Control */}
            <div className="relative flex items-center gap-3">
              <button
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-pressed={launched}
                aria-label={
                  launched
                    ? 'Site status: Live. Toggle preview state.'
                    : 'Site status: In Development. Toggle preview state.'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setLaunched((prev) => !prev);
                }}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-1.5 text-[11.5px] font-medium tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  launched
                    ? 'bg-white text-black'
                    : 'border border-white/25 bg-black text-white/85'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    launched ? 'bg-black' : 'bg-white/70'
                  }`}
                />
                <span>{launched ? 'LIVE' : 'IN DEVELOPMENT'}</span>
              </button>

              {/* Extending directional arrow */}
              <ArrowUpRight
                aria-hidden="true"
                className={`h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.22,0.8,0.2,1)] ${
                  launched
                    ? 'translate-x-0.5 -translate-y-0.5 scale-110 text-white opacity-100'
                    : 'translate-x-0 translate-y-0 text-white/60 opacity-65'
                }`}
              />

              {/* Animated Cursor approaching the Launch Control */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className={`pointer-events-none absolute -bottom-3 right-8 z-20 h-4 w-4 transition-all duration-700 ease-[cubic-bezier(0.22,0.8,0.2,1)] ${
                  cursorPressed
                    ? 'translate-x-0 translate-y-0 opacity-0 scale-90'
                    : isActive
                    ? 'translate-x-6 translate-y-4 opacity-95'
                    : 'translate-x-10 translate-y-8 opacity-0'
                }`}
              >
                <path
                  d="M4 3 L19 11 L12 13 L9 20 Z"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>

          {/* Website Preview revealed with smooth clipping-mask animation */}
          <div className="relative flex-1 overflow-hidden bg-black">
            <div
              className="h-full w-full transition-[clip-path,opacity] duration-700 ease-[cubic-bezier(0.22,0.8,0.2,1)]"
              style={{
                clipPath: launched ? 'inset(0% 0% 0% 0%)' : 'inset(3% 2% 4% 2%)',
                opacity: launched ? 1 : 0.82,
              }}
            >
              <WebsiteMockup direction="architecture" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status line */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-3 text-[11.5px] tracking-[0.12em] uppercase text-white/70">
        <span>Selected Production Build</span>
        <span className={launched ? 'text-white' : 'text-white/75'}>
          {launched ? 'Ready for Visitors' : 'Final Checks'}
        </span>
      </div>
    </div>
  );
}
