import { ArrowUpRight } from 'lucide-react';
import type { EnquiryTopic } from './Navbar';

interface HeroSectionProps {
  onOpenEnquiry: (topic?: EnquiryTopic) => void;
}

export function HeroSection({ onOpenEnquiry }: HeroSectionProps) {
  return (
    <section
      id="top"
      aria-label="Studio Introduction"
      className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col justify-between px-4 pt-6 pb-6 sm:px-6 md:px-10 md:pt-8 md:pb-8 lg:px-14 lg:pt-10 lg:pb-10"
    >
      {/* Top / Center Editorial Statement */}
      <div className="my-auto max-w-5xl py-3 sm:py-4">
        <p className="ll-anim-rise mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-[13.5px] font-normal tracking-[0.04em] text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)] sm:mb-5">
          <span>Ahmedabad</span>
          <span aria-hidden="true" className="text-white/60">
            ·
          </span>
          <span>Available Worldwide</span>
        </p>

        <h1 className="ll-anim-rise font-heading text-[clamp(2.35rem,min(5.8vw,8.6dvh),5.65rem)] font-normal leading-[0.94] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] [text-wrap:balance]">
          Websites shaped with <span className="italic text-white">editorial clarity</span> and
          quiet precision.
        </h1>
      </div>

      {/* Bottom Architectural Split */}
      <div className="ll-anim-rise relative grid grid-cols-1 items-end gap-6 border-t border-white/20 pt-5 md:grid-cols-12 md:gap-8 md:pt-6">
        <div className="md:col-span-6">
          <p className="max-w-[54ch] font-body text-[15px] font-normal leading-[1.6] tracking-[0.01em] text-white/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.7)] sm:text-[16px]">
            LaunchLayer is an independent web design and development studio partnering with
            founders and growing brands on custom websites, storefronts, and digital products.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 md:col-span-6 md:items-end">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[13px] font-normal tracking-[0.02em] text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)] tabular-nums md:justify-end">
            <span>Landing Pages</span>
            <span aria-hidden="true" className="text-white/50">
              ·
            </span>
            <span>Business Sites</span>
            <span aria-hidden="true" className="text-white/50">
              ·
            </span>
            <span>E-Commerce</span>
            <span aria-hidden="true" className="text-white/50">
              ·
            </span>
            <span className="font-medium text-white">From $249 / ₹19,999</span>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={() => onOpenEnquiry('General')}
              className="liquid-glass-strong flex min-h-[44px] items-center gap-2 rounded-full px-6 py-2.5 font-body text-sm font-medium text-white transition-all hover:bg-white/15 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>Book a Call</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="flex min-h-[44px] items-center gap-2 rounded-full bg-white px-6 py-2.5 font-body text-sm font-medium text-black transition-colors hover:bg-white/90 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
