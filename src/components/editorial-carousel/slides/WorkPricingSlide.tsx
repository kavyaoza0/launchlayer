import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { WebsiteMockup, type MockupDirection } from '../WebsiteMockups';

interface WorkPricingSlideProps {
  isActive: boolean;
  prefersReducedMotion?: boolean;
  onSelectPricing: (tierId?: string) => void;
}

const PRICING_TIERS: {
  id: string;
  num: string;
  name: string;
  usd: string;
  inr: string;
  timeline: string;
  detail: string;
  deliverables: [string, string];
  direction: MockupDirection;
  featured: boolean;
}[] = [
  {
    id: 'starter',
    num: '01',
    name: 'Starter',
    usd: '$249',
    inr: '₹19,999',
    timeline: '1–2 Weeks',
    detail: 'Focused single-page launch designed for clarity and first impressions.',
    deliverables: ['Custom landing design', 'Responsive & SEO setup'],
    direction: 'architecture',
    featured: false,
  },
  {
    id: 'business',
    num: '02',
    name: 'Business',
    usd: '$599',
    inr: '₹44,999',
    timeline: '2–3 Weeks',
    detail: 'Complete multi-page site built to communicate services and credibility.',
    deliverables: ['Up to 5 custom pages', 'Custom visual direction'],
    direction: 'lifestyle',
    featured: false,
  },
  {
    id: 'signature',
    num: '03',
    name: 'Signature',
    usd: '$1,199',
    inr: '₹89,999',
    timeline: '3–5 Weeks',
    detail: 'Expressive custom website with refined interactions and bespoke motion.',
    deliverables: ['Up to 8 bespoke pages', 'Interactive motion craft'],
    direction: 'ecommerce',
    featured: true,
  },
  {
    id: 'bespoke',
    num: '04',
    name: 'Bespoke',
    usd: '$2,000+',
    inr: '₹1,50,000+',
    timeline: 'Scoped',
    detail: 'Tailored web architecture, storefronts, and custom interactive products.',
    deliverables: ['Custom architecture', 'Tailored integrations'],
    direction: 'hardware',
    featured: false,
  },
];

export function WorkPricingSlide({
  isActive,
  prefersReducedMotion = false,
  onSelectPricing,
}: WorkPricingSlideProps) {
  const [selectedIdx, setSelectedIdx] = useState(2);
  const currentTier = PRICING_TIERS[selectedIdx];

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-black px-5 py-4 font-body text-white sm:px-8 sm:py-6 md:px-10 md:py-7 lg:overflow-hidden lg:px-14 lg:py-8">
      {/* Quiet Monochrome Studio Spotlight */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[10%] top-1/2 h-[440px] w-[760px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_72%)] blur-[110px]" />
      </div>

      {/* Top Editorial Masthead */}
      <div className="relative z-10 flex flex-col gap-2.5 border-b border-white/15 pb-3.5">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
          <span className="text-white">06 · Work &amp; Investment</span>
          <span>Transparent Starting Points</span>
        </div>

        <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-end">
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[clamp(2.1rem,min(4.2vw,6.4dvh),4rem)] font-normal leading-[0.94] tracking-tight text-white [text-wrap:balance]"
          >
            Thoughtful work. <span className="italic">Clear</span> investment.
          </motion.h2>
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[42ch] text-[13.5px] font-normal leading-[1.55] text-white/75"
          >
            One-time project starting rates with transparent timelines. Select any tier to inspect
            or begin a brief.
          </motion.p>
        </div>
      </div>

      {/* Atelier Split: Left Curated Specimen & Deliverables Plate + Right Typographic Fee Schedule */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="relative z-10 my-auto grid flex-1 grid-cols-1 items-center gap-6 py-4 sm:gap-8 lg:grid-cols-12 lg:gap-10"
      >
        {/* Left: Reactive Specimen Showcase + Selected Tier Overview (Single-Level Frame) */}
        <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-white/18 bg-[#080808] lg:col-span-5">
          {/* Top Specimen Window */}
          <div
            aria-hidden="true"
            className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/12 bg-black"
          >
            {PRICING_TIERS.map((tier, idx) => (
              <div
                key={tier.id}
                className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  selectedIdx === idx
                    ? 'opacity-100 scale-100'
                    : 'pointer-events-none opacity-0 scale-[1.015]'
                }`}
              >
                <WebsiteMockup direction={tier.direction} compact />
              </div>
            ))}
          </div>

          {/* Selected Tier Summary & Direct CTA */}
          <div className="flex flex-col justify-between gap-4 p-4 sm:p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTier.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline justify-between gap-3"
              >
                <div>
                  <span className="font-space-mono text-[10.5px] tracking-[0.14em] uppercase text-white/65">
                    {currentTier.num} · Selected Scope
                  </span>
                  <h3 className="mt-0.5 font-heading text-[1.65rem] font-normal leading-none text-white sm:text-[1.85rem]">
                    {currentTier.name}
                  </h3>
                </div>

                <div className="text-right tabular-nums">
                  <span className="block font-heading text-[1.45rem] leading-none text-white">
                    {currentTier.usd}
                  </span>
                  <span className="mt-1 block font-space-mono text-[10.5px] text-white/70">
                    {currentTier.inr} · {currentTier.timeline}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-3.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTier.id}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-0.5 text-[12.5px] text-white/80"
                >
                  <span>{currentTier.deliverables[0]}</span>
                  <span className="text-white/65">{currentTier.deliverables[1]}</span>
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={`Continue with ${currentTier.name} package starting at ${currentTier.usd}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPricing(currentTier.id);
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 py-2 text-[13px] font-medium text-black transition-colors hover:bg-white/90 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <span>Start {currentTier.name}</span>
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Clean Unboxed Architectural Fee Schedule */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <div className="divide-y divide-white/15 border-y border-white/20">
            {PRICING_TIERS.map((tier, idx) => {
              const active = selectedIdx === idx;
              return (
                <button
                  key={tier.id}
                  type="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-pressed={active}
                  aria-label={`Inspect or choose ${tier.name} package starting at ${tier.usd} or ${tier.inr}, ${tier.timeline}`}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  onFocus={() => setSelectedIdx(idx)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (active) {
                      onSelectPricing(tier.id);
                    } else {
                      setSelectedIdx(idx);
                    }
                  }}
                  className="group relative flex min-h-[60px] w-full items-center justify-between gap-4 px-3 py-3.5 text-left transition-colors duration-200 hover:bg-white/[0.02] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-5 sm:py-4"
                >
                  {active && (
                    <motion.span
                      layoutId="pricing-tier-bg"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 280, damping: 32 }
                      }
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-white/[0.06]"
                    />
                  )}

                  <div className="relative z-10 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <span className="font-space-mono text-[11px] tracking-[0.12em] text-white/60 tabular-nums">
                        {tier.num}
                      </span>
                      <span
                        className={`font-heading text-[1.5rem] leading-none transition-colors sm:text-[1.75rem] ${
                          active ? 'text-white' : 'text-white/85 group-hover:text-white'
                        }`}
                      >
                        {tier.name}
                      </span>
                      {tier.featured && (
                        <span className="font-heading italic text-[14px] text-white/80">
                          Most Selected
                        </span>
                      )}
                    </div>

                    <p className="mt-1 truncate text-[13px] font-normal text-white/75">
                      {tier.detail}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-4 shrink-0 text-right">
                    <div className="tabular-nums">
                      <span className="block font-heading text-[1.55rem] leading-none text-white sm:text-[1.85rem]">
                        {tier.usd}
                      </span>
                      <span className="mt-1 block font-space-mono text-[10.5px] text-white/65">
                        {tier.inr}
                      </span>
                    </div>

                    <ArrowUpRight
                      aria-hidden="true"
                      className={`h-4 w-4 transition-all duration-200 ${
                        active
                          ? 'translate-x-0.5 -translate-y-0.5 text-white'
                          : 'text-white/45 group-hover:text-white'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quiet Editorial Scope Note */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-3 text-[12px] font-normal text-white/75">
        <span>
          Final pricing depends on project scope, integrations, and timeline. Domain &amp; hosting
          billed separately.
        </span>
        <span className="hidden font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/70 sm:inline">
          Click again to enquire
        </span>
      </div>
    </div>
  );
}
