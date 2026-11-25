import { ArrowUpRight } from 'lucide-react';

interface EndCardSlideProps {
  isActive: boolean;
  onStartConversation: () => void;
}

export function EndCardSlide({
  isActive,
  onStartConversation,
}: EndCardSlideProps) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black p-4 font-body text-white sm:p-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Soft monochrome radial aura behind conversation headline and CTA */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[18%] top-1/2 h-[420px] w-[720px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.065)_0%,transparent_74%)] blur-[96px]" />
      </div>

      {/* Top Status Detail */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-3.5 text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
        <span className="text-white">07 · LET&apos;S BUILD SOMETHING</span>
        <span className="text-white/90">AVAILABLE FOR SELECT PROJECTS</span>
      </div>

      {/* Center Editorial Statement + Liquid Glass CTA */}
      <div className="relative z-10 my-auto flex flex-col items-start justify-center py-4 sm:py-6">
        <h2 className="max-w-[18ch] font-heading text-[clamp(2.15rem,min(4.8vw,7.2dvh),4.35rem)] leading-[0.94] tracking-tight text-white [text-wrap:balance]">
          Your next website starts with a <span className="italic">conversation</span>.
        </h2>

        <p className="mt-4 max-w-[48ch] text-[14px] font-normal leading-[1.6] text-white/80 sm:text-[15px]">
          Have an idea, a business or something you want to bring online? Tell us what you&apos;re
          thinking. Let&apos;s find the right direction together.
        </p>

        {/* Primary Liquid-Glass CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-5 sm:mt-8">
          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              onStartConversation();
            }}
            className="liquid-glass-strong group inline-flex min-h-[48px] items-center gap-2.5 rounded-full px-7 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/15 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Book a Call</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-5 w-5 transition-transform duration-200 ease-[cubic-bezier(0.22,0.8,0.2,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>

      {/* Bottom Studio Identity & Contact */}
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 border-t border-white/15 pt-4">
        <div>
          <span className="font-heading text-[24px] leading-none text-white sm:text-[26px]">LaunchLayer</span>
          <p className="mt-1.5 text-[12.5px] font-normal tracking-[0.04em] text-white/75">
            Ahmedabad, India · Working Worldwide
          </p>
        </div>

        <a
          href="mailto:hello@launchlayer.in"
          tabIndex={isActive ? 0 : -1}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex min-h-[44px] items-center border-b border-white/40 pb-0.5 text-[13.5px] font-medium text-white/90 transition-colors hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          hello@launchlayer.in
        </a>
      </div>
    </div>
  );
}
