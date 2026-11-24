import { ArrowUpRight } from 'lucide-react';
import { WebsiteMockup } from '../WebsiteMockups';

interface WorkPricingSlideProps {
  isActive: boolean;
  onSelectPricing: () => void;
}

const PRICING_TIERS = [
  { name: 'STARTER', price: '$249 / ₹19,999', detail: 'Landing Page', featured: false },
  { name: 'BUSINESS', price: '$599 / ₹44,999', detail: 'Up to 5 Pages', featured: false },
  {
    name: 'SIGNATURE',
    price: '$1,199 / ₹89,999',
    detail: 'Up to 8 Pages · Bespoke Direction',
    featured: true,
  },
  { name: 'BESPOKE', price: '$2,000+ / ₹1,50,000+', detail: 'Custom Web & E-Commerce', featured: false },
] as const;

export function WorkPricingSlide({
  isActive,
  onSelectPricing,
}: WorkPricingSlideProps) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-black p-6 font-body text-white sm:p-10 lg:px-14 lg:py-10">
      {/* Soft monochrome ambient lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[10%] top-1/2 h-[380px] w-[640px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_74%)] blur-[96px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-1.5 border-b border-white/12 pb-4">
        <div className="flex items-center justify-between text-[10px] font-medium tracking-[0.14em] uppercase text-white/50 sm:text-[11px]">
          <span className="text-white/80">06 · WORK &amp; INVESTMENT</span>
          <span>TRANSPARENT STARTING POINTS</span>
        </div>
        <h2 className="font-heading text-[clamp(1.85rem,3.6vw,3.15rem)] leading-[0.95] tracking-tight text-white">
          Thoughtful work. <span className="italic">Clear</span> investment.
        </h2>
      </div>

      {/* Main Split: Selected Work Visual Stack + Typographic Pricing */}
      <div className="relative z-10 my-auto grid flex-1 grid-cols-1 items-center gap-5 py-4 sm:grid-cols-12 sm:gap-8 sm:py-5">
        {/* Left: Selected Work Visual Priority */}
        <div className="relative hidden h-full max-h-[56dvh] sm:col-span-5 sm:block">
          <div className="flex h-full flex-col justify-between gap-3">
            <div className="flex items-center justify-between text-[10px] tracking-[0.12em] uppercase text-white/50">
              <span>Selected Concepts</span>
              <span className="text-white/80">2026</span>
            </div>

            <div className="relative flex-1">
              <div className="ll-glow-border absolute inset-x-0 top-0 h-[56%] overflow-hidden rounded-xl border bg-[#0b0b0b]">
                <WebsiteMockup direction="ecommerce" compact />
              </div>
              <div className="ll-glow-border-strong absolute inset-x-4 bottom-0 h-[54%] overflow-hidden rounded-xl border bg-[#0b0b0b]">
                <WebsiteMockup direction="hardware" compact />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Typographic Pricing List */}
        <div className="flex flex-col justify-between sm:col-span-7">
          <div className="divide-y divide-white/12 border-y border-white/16">
            {PRICING_TIERS.map((tier) => (
              <button
                key={tier.name}
                type="button"
                tabIndex={isActive ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPricing();
                }}
                className={`group flex min-h-[48px] w-full items-baseline justify-between gap-4 px-3 py-3 text-left transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4 sm:py-4 ${
                  tier.featured
                    ? 'bg-white/[0.06] text-white'
                    : 'hover:bg-white/[0.03] text-white/90'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[12px] font-semibold tracking-[0.14em] uppercase sm:text-[13px]">
                      {tier.name}
                    </span>
                    {tier.featured && (
                      <span className="font-space-mono text-[9px] tracking-[0.14em] text-white/60">
                        · RECOMMENDED
                      </span>
                    )}
                  </div>
                  <span className="mt-1 block text-[11px] font-light text-white/55 sm:text-[12px]">
                    {tier.detail}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="font-heading text-[22px] tracking-tight tabular-nums text-white sm:text-[26px]">
                    {tier.price}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/50 opacity-0 transition-all duration-150 group-hover:text-white group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scope Note */}
      <div className="relative z-10 border-t border-white/12 pt-3">
        <p className="text-[10.5px] font-light leading-[1.5] text-white/50 sm:text-[11.5px]">
          Every project is different. Final pricing depends on scope, functionality and
          requirements. Domain, hosting, paid integrations and third-party services may be charged
          separately.
        </p>
      </div>
    </div>
  );
}
