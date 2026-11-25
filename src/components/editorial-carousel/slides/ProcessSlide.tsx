import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface ProcessSlideProps {
  isActive: boolean;
  prefersReducedMotion: boolean;
}

const STEPS = [
  {
    num: '01',
    title: 'The Basics',
    body: 'First, we get to know the essentials. Your business, what you offer, where you are today and what you want to achieve.',
  },
  {
    num: '02',
    title: 'Your Audience',
    body: 'Who are we building for? We understand the people you want to reach, what they need and what makes them choose you.',
  },
  {
    num: '03',
    title: 'Logo & Images',
    body: 'Your visual identity matters. We gather your logo, colours, images and references to understand the look and feel that belongs to your brand.',
  },
  {
    num: '04',
    title: 'Your Business',
    body: 'We explore your services, products, content and requirements to establish what your website needs to do.',
  },
] as const;

function StepIcon({ index, active }: { index: number; active: boolean }) {
  const stroke = active ? '#FFFFFF' : '#737373';
  const accent = active ? 'rgba(255,255,255,0.85)' : '#525252';

  switch (index) {
    case 0:
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none">
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            stroke={stroke}
            strokeWidth="1.25"
            className="transition-all duration-300"
          />
          <circle
            cx="12"
            cy="12"
            r={active ? '3.5' : '2'}
            stroke={accent}
            strokeWidth="1.25"
            className="transition-all duration-300"
          />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none">
          <circle
            cx={active ? '9.5' : '10.5'}
            cy="12"
            r="4.5"
            stroke={stroke}
            strokeWidth="1.25"
            className="transition-all duration-300"
          />
          <circle
            cx={active ? '14.5' : '13.5'}
            cy="12"
            r="4.5"
            stroke={accent}
            strokeWidth="1.25"
            className="transition-all duration-300"
          />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none">
          <rect x="4" y="5" width="16" height="14" stroke={stroke} strokeWidth="1.25" />
          <path
            d={active ? 'M4 16 L9.5 10.5 L14 14.5 L16.5 12 L20 16' : 'M4 16 L10 13 L15 15 L20 13'}
            stroke={accent}
            strokeWidth="1.25"
            className="transition-all duration-300"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none">
          <path
            d="M4 17 L10 11 L14 14 L20 7"
            stroke={stroke}
            strokeWidth="1.25"
            className="transition-all duration-300"
          />
          <path
            d={active ? 'M15.5 7 H20 V11.5' : 'M17 7 H20 V10'}
            stroke={accent}
            strokeWidth="1.25"
            className="transition-all duration-300"
          />
        </svg>
      );
  }
}

export function ProcessSlide({ isActive, prefersReducedMotion }: ProcessSlideProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, [isActive, prefersReducedMotion]);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black p-4 font-body text-white sm:p-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Soft monochrome radial glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[380px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.055)_0%,transparent_74%)] blur-[96px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-2 border-b border-white/15 pb-3.5">
        <div className="flex items-center justify-between text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
          <span className="text-white">02 · HOW WE WORK</span>
          <span>FOUR STEPS, ONE DIRECTION</span>
        </div>
        <div className="flex flex-col justify-between gap-2.5 lg:flex-row lg:items-end">
          <h2 className="font-heading text-[clamp(1.75rem,min(3.4vw,5.2dvh),3rem)] leading-[0.96] tracking-tight text-white [text-wrap:balance]">
            Every great website starts with <span className="italic text-white">understanding</span>.
          </h2>
          <p className="max-w-[46ch] text-[13px] font-normal leading-[1.55] text-white/80 sm:text-[14px]">
            Before we design a single screen, we take the time to understand your business, your
            audience and the direction you want to take.
          </p>
        </div>
      </div>

      {/* Connected Four-Step Editorial Track */}
      <div className="relative z-10 my-auto flex flex-1 flex-col justify-center py-3 sm:py-4">
        {/* Progressively drawing horizontal SVG spine across desktop/tablet */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 8"
          preserveAspectRatio="none"
          className="mb-3.5 hidden h-2 w-full sm:block"
        >
          <line x1="0" y1="4" x2="1200" y2="4" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          <line
            x1="0"
            y1="4"
            x2="1200"
            y2="4"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="1.5"
            className="transition-all duration-700 ease-out"
            strokeDasharray="1200"
            strokeDashoffset={isActive || prefersReducedMotion ? 0 : 1200}
          />
        </svg>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {STEPS.map((step, idx) => {
            const selected = activeStep === idx;
            return (
              <button
                key={step.num}
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-pressed={selected}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStep(idx);
                }}
                onMouseEnter={() => setActiveStep(idx)}
                className={`group relative flex min-h-[44px] flex-col justify-between rounded-xl p-3.5 text-left transition-all duration-300 ease-[cubic-bezier(0.22,0.8,0.2,1)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-4 lg:p-5 ${
                  selected
                    ? 'liquid-glass-strong bg-white/[0.06] text-white shadow-[0_18px_48px_rgba(0,0,0,0.85)]'
                    : 'border border-white/15 bg-white/[0.02] text-white/80 hover:border-white/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-heading text-[26px] leading-none tracking-tight transition-colors duration-300 sm:text-[34px] ${
                      selected ? 'text-white' : 'text-white/65'
                    }`}
                  >
                    {step.num}
                  </span>

                  <div className="flex items-center gap-2">
                    <StepIcon index={idx} active={selected} />
                    {idx < STEPS.length - 1 && (
                      <ArrowRight
                        aria-hidden="true"
                        className={`hidden h-3.5 w-3.5 transition-all duration-300 lg:block ${
                          selected ? 'translate-x-0.5 text-white' : 'text-white/45'
                        }`}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <h3
                    className={`font-body text-[15px] font-medium transition-colors duration-300 sm:text-[16px] ${
                      selected ? 'text-white' : 'text-white/90'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`mt-1.5 text-[12.5px] font-normal leading-[1.55] transition-colors duration-300 sm:text-[13px] ${
                      selected ? 'text-white/90' : 'text-white/75'
                    }`}
                  >
                    {step.body}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiet bottom progress cue */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-3 text-[11.5px] tracking-[0.12em] uppercase text-white/70">
        <span>Connected Discovery Track</span>
        <span className="tabular-nums text-white">Step {STEPS[activeStep].num} / 04</span>
      </div>
    </div>
  );
}
