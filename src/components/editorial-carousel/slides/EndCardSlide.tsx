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
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-black p-6 font-body text-white sm:p-10 lg:px-14 lg:py-10">
      {/* Soft monochrome radial aura behind conversation headline and CTA */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[18%] top-1/2 h-[420px] w-[720px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.065)_0%,transparent_74%)] blur-[96px]" />
      </div>

      {/* Top Status Detail */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/12 pb-4 text-[10px] font-medium tracking-[0.14em] uppercase text-white/50 sm:text-[11px]">
        <span className="text-white/80">07 · LET&apos;S BUILD SOMETHING</span>
        <span className="text-white/85">AVAILABLE FOR SELECT PROJECTS</span>
      </div>

      {/* Center Editorial Statement + Liquid Glass CTA */}
      <div className="relative z-10 my-auto flex flex-col items-start justify-center py-6">
        <h2 className="max-w-[18ch] font-heading text-[clamp(2.4rem,5.4vw,4.65rem)] leading-[0.9] tracking-tight text-white [text-wrap:balance]">
          Your next website starts with a <span className="italic">conversation</span>.
        </h2>

        <p className="mt-5 max-w-[48ch] text-[13px] font-light leading-[1.6] text-white/60 sm:text-[15px]">
          Have an idea, a business or something you want to bring online? Tell us what you&apos;re
          thinking. Let&apos;s find the right direction together.
        </p>

        {/* Primary Liquid-Glass CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-5 sm:mt-10">
          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              onStartConversation();
            }}
            className="liquid-glass-strong group inline-flex min-h-[48px] items-center gap-2.5 rounded-full px-7 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 border-t border-white/12 pt-4">
        <div>
          <span className="font-heading text-[25px] leading-none text-white">LaunchLayer</span>
          <p className="mt-1.5 text-[11.5px] font-light tracking-[0.06em] text-white/50">
            Ahmedabad, India · Working Worldwide
          </p>
        </div>

        <a
          href="mailto:hello@launchlayer.in"
          tabIndex={isActive ? 0 : -1}
          onClick={(e) => e.stopPropagation()}
          className="border-b border-white/30 pb-0.5 text-[12.5px] font-medium text-white/80 transition-colors hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          hello@launchlayer.in
        </a>
      </div>
    </div>
  );
}
