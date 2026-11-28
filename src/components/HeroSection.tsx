import { ArrowUpRight } from 'lucide-react';
import type { EnquiryTopic } from './Navbar';

interface HeroSectionProps {
  onOpenEnquiry: (topic?: EnquiryTopic) => void;
  entranceDone?: boolean;
}

export function HeroSection({ onOpenEnquiry, entranceDone = true }: HeroSectionProps) {
  return (
    <section
      id="top"
      tabIndex={-1}
      aria-label="Studio Introduction"
      className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-5 pt-6 pb-8 text-center sm:px-8 sm:py-10 lg:px-14 [@media(max-height:580px)]:py-3 focus:outline-none"
    >
      <div
        key={entranceDone ? 'hero-ready' : 'hero-wait'}
        className={`flex w-full max-w-[960px] flex-col items-center transition-opacity duration-700 ${
          entranceDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Quiet Architectural Studio Eyebrow */}
        <p className="ll-anim-rise ll-hero-text-shadow mb-4 flex items-center justify-center gap-3 font-space-mono text-[11px] font-normal tracking-[0.2em] uppercase text-white/80 sm:mb-6 sm:text-[11.5px]">
          <span aria-hidden="true" className="hidden h-px w-8 bg-white/30 sm:inline-block" />
          <span>Based in Ahmedabad · Working Worldwide</span>
          <span aria-hidden="true" className="hidden h-px w-8 bg-white/30 sm:inline-block" />
        </p>

        {/* Centered Editorial Headline with Calligraphic Script Focal Phrase */}
        <h1 className="ll-anim-rise flex flex-col items-center font-heading text-[clamp(2.25rem,min(4.8vw,6.8dvh),4.65rem)] font-normal leading-[0.98] tracking-[-0.02em] text-white [text-wrap:balance]">
          <span className="ll-hero-text-shadow">Websites shaped with</span>
          <span className="ll-script-shimmer -my-1 inline-block px-6 py-2 font-script text-[clamp(3.6rem,min(8.6vw,11.4dvh),7.4rem)] font-normal leading-[0.86] tracking-[0.01em] sm:-my-1.5 sm:px-10">
            editorial clarity
          </span>
          <span className="ll-hero-text-shadow text-white">and quiet precision.</span>
        </h1>

        {/* Refined Studio Descriptor */}
        <p className="ll-anim-rise ll-hero-text-shadow mt-5 max-w-[54ch] font-body text-[14.5px] font-normal leading-[1.62] tracking-[0.01em] text-white/88 sm:mt-6 sm:text-[15.5px] [@media(max-height:540px)]:mt-3">
          We design and build custom websites, online stores, and digital products for founders and
          growing businesses.
        </p>

        {/* Unboxed Service Capabilities & Starting Rate */}
        <div className="ll-anim-rise ll-hero-text-shadow mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-space-mono text-[11px] tracking-[0.08em] text-white/75 tabular-nums sm:mt-5 sm:text-[11.5px]">
          <span>Landing Pages</span>
          <span aria-hidden="true" className="text-white/35">
            ·
          </span>
          <span>Business Websites</span>
          <span aria-hidden="true" className="text-white/35">
            ·
          </span>
          <span>Online Stores</span>
          <span aria-hidden="true" className="text-white/35">
            ·
          </span>
          <span className="font-medium text-white">Starting at $249 / ₹19,999</span>
        </div>

        {/* Centered CTA Pair */}
        <div className="ll-anim-rise mt-7 flex flex-wrap items-center justify-center gap-3.5 sm:mt-8 sm:gap-4 [@media(max-height:540px)]:mt-4">
          <button
            type="button"
            onClick={() => onOpenEnquiry('General')}
            className="apple-liquid-pill group flex min-h-[46px] items-center gap-2 rounded-full px-7 py-2.5 font-body text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Book a Call</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() =>
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group flex min-h-[46px] items-center gap-2 rounded-full bg-white px-7 py-2.5 font-body text-sm font-medium text-black shadow-[0_12px_32px_rgba(0,0,0,0.55)] transition-all duration-200 hover:scale-[1.02] hover:bg-white/92 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>View Pricing</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
        </div>

        {/* Quiet scroll invitation into 3D showcase */}
        <button
          type="button"
          onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
          className="ll-anim-rise ll-hero-text-shadow mt-8 inline-flex min-h-[44px] items-center gap-2 font-space-mono text-[10.5px] tracking-[0.2em] uppercase text-white/60 transition-colors hover:text-white cursor-pointer sm:mt-10 [@media(max-height:660px)]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full px-3"
        >
          <span>See our work</span>
          <span aria-hidden="true">&#8595;</span>
        </button>
      </div>
    </section>
  );
}
