import { ArrowUpRight } from 'lucide-react';
import type { EnquiryTopic } from './Navbar';

interface HeroSectionProps {
  onOpenEnquiry: (topic?: EnquiryTopic) => void;
}

export function HeroSection({ onOpenEnquiry }: HeroSectionProps) {
  return (
    <section
      id="top"
      tabIndex={-1}
      aria-label="Studio Introduction"
      className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col justify-between px-5 pt-5 pb-5 sm:px-8 md:pt-8 md:pb-8 lg:px-14 lg:pt-10 lg:pb-10 [@media(max-height:540px)]:pt-2 [@media(max-height:540px)]:pb-3 focus:outline-none"
    >
      {/* Top / Center Editorial Statement */}
      <div className="my-auto max-w-4xl py-2 sm:py-4">
        <p className="ll-anim-rise mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-[13px] font-medium tracking-[0.04em] text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:mb-4 sm:text-[13.5px]">
          <span>Ahmedabad</span>
          <span aria-hidden="true" className="text-white/75">
            ·
          </span>
          <span>Available Worldwide</span>
        </p>

        <h1 className="ll-anim-rise font-heading text-[clamp(2.1rem,min(4.8vw,7.2dvh),4.85rem)] font-normal leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_26px_rgba(0,0,0,0.85)] [text-wrap:balance]">
          Websites shaped with <span className="italic text-white">editorial clarity</span> and
          quiet precision.
        </h1>
      </div>

      {/* Bottom Architectural Split */}
      <div className="ll-anim-rise relative grid grid-cols-1 items-end gap-5 border-t border-white/25 pt-4 md:grid-cols-12 md:gap-8 md:pt-6">
        <div className="md:col-span-6">
          <p className="max-w-[54ch] font-body text-[14.5px] font-normal leading-[1.6] tracking-[0.01em] text-white/95 drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)] sm:text-[15.5px]">
            LaunchLayer is an independent web design and development studio partnering with
            founders and growing brands on custom websites, storefronts, and digital products.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3.5 md:col-span-6 md:items-end md:gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[13px] font-medium tracking-[0.02em] text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.92)] tabular-nums md:justify-end">
            <span>Landing Pages</span>
            <span aria-hidden="true" className="text-white/70">
              ·
            </span>
            <span>Business Sites</span>
            <span aria-hidden="true" className="text-white/70">
              ·
            </span>
            <span>E-Commerce</span>
            <span aria-hidden="true" className="text-white/70">
              ·
            </span>
            <span className="font-semibold text-white">From $249 / ₹19,999</span>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={() => onOpenEnquiry('General')}
              className="liquid-glass-strong flex min-h-[44px] items-center gap-2 rounded-full bg-black/50 px-6 py-2.5 font-body text-sm font-medium text-white transition-all hover:bg-black/75 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>Book a Call</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="flex min-h-[44px] items-center gap-2 rounded-full bg-white px-6 py-2.5 font-body text-sm font-medium text-black shadow-lg transition-colors hover:bg-white/90 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>View Pricing</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
