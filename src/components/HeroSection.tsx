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
      className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col justify-between px-6 pt-8 pb-8 md:px-12 md:pt-12 md:pb-12 lg:px-16 lg:pt-14 lg:pb-14"
    >
      {/* Top / Center Editorial Statement */}
      <div className="my-auto max-w-6xl py-4">
        <p className="ll-anim-rise mb-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-[13.5px] font-light tracking-[0.04em] text-white/65">
          <span>Ahmedabad</span>
          <span aria-hidden="true" className="text-white/40">
            ·
          </span>
          <span>Available Worldwide</span>
        </p>

        <h1 className="ll-anim-rise font-heading text-[clamp(3.35rem,7.4vw,7rem)] font-normal leading-[0.9] tracking-tight text-white [text-wrap:balance]">
          Websites shaped with <span className="italic text-white">editorial clarity</span> and
          quiet precision.
        </h1>
      </div>

      {/* Bottom Architectural Split */}
      <div className="ll-anim-rise relative grid grid-cols-1 items-end gap-8 border-t border-white/15 pt-6 md:grid-cols-12 md:gap-10 md:pt-8">
        <div className="md:col-span-6 lg:col-span-6">
          <p className="max-w-[58ch] font-body text-[15.5px] font-light leading-[1.65] tracking-[0.01em] text-white/80 md:text-[16.5px]">
            LaunchLayer is an independent web design and development studio partnering with
            founders and growing brands on custom websites, storefronts, and digital products.
          </p>
        </div>

        <div className="flex flex-col items-start gap-5 md:col-span-6 md:items-end lg:col-span-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[13px] font-light tracking-[0.02em] text-white/65 tabular-nums md:justify-end">
            <span>Landing Pages</span>
            <span aria-hidden="true" className="text-white/30">
              ·
            </span>
            <span>Business Sites</span>
            <span aria-hidden="true" className="text-white/30">
              ·
            </span>
            <span>E-Commerce</span>
            <span aria-hidden="true" className="text-white/30">
              ·
            </span>
            <span className="font-medium text-white">From $249 / ₹19,999</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onOpenEnquiry('General')}
              className="liquid-glass-strong flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-white transition-all hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Book a Call</span>
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-body text-sm font-medium text-black transition-colors hover:bg-white/90 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
