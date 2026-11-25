import type { PointerEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EnquiryTopic } from './Navbar';

type Feature = {
  text: string;
  included: boolean;
};

type Plan = {
  number: string;
  name: string;
  subtitle: string;
  usd: string;
  inr: string;
  description: string;
  features: Feature[];
  featured?: boolean;
  badge?: string;
  cta: string;
};

export interface PricingSectionProps {
  onSelectPackage?: (topic: EnquiryTopic, tierId?: string) => void;
}

const plans: Plan[] = [
  {
    number: '01',
    name: 'Starter',
    subtitle: 'A focused beginning',
    usd: '$249',
    inr: '₹19,999',
    description:
      'A polished landing page for individuals, new businesses and product launches that need a strong first impression.',
    features: [
      { text: 'Custom landing page design', included: true },
      { text: 'Responsive development', included: true },
      { text: 'Essential sections and content', included: true },
      { text: 'Contact form integration', included: true },
      { text: 'Basic SEO setup', included: true },
    ],
    cta: 'Start with Starter',
  },
  {
    number: '02',
    name: 'Business',
    subtitle: 'Built to establish your presence',
    usd: '$599',
    inr: '₹44,999',
    description:
      'A complete business website designed to communicate services, build credibility and establish a professional online presence.',
    features: [
      { text: 'Multi-page website', included: true },
      { text: 'Custom visual direction', included: true },
      { text: 'Responsive development', included: true },
      { text: 'Contact and enquiry forms', included: true },
      { text: 'Essential SEO setup', included: true },
    ],
    cta: 'Choose Business',
  },
  {
    number: '03',
    name: 'Signature',
    subtitle: 'For brands that want more',
    usd: '$1,199',
    inr: '₹89,999',
    description:
      'A distinctive, custom-designed digital experience with refined visuals, expressive interactions and advanced animations.',
    features: [
      { text: 'Bespoke website design', included: true },
      { text: 'Advanced interactions', included: true },
      { text: 'Custom animations', included: true },
      { text: 'Responsive development', included: true },
      { text: 'Enhanced SEO and performance', included: true },
    ],
    featured: true,
    badge: 'MOST POPULAR',
    cta: 'Explore Signature',
  },
  {
    number: '04',
    name: 'Bespoke',
    subtitle: 'Made around your vision',
    usd: '$2,000+',
    inr: '₹1,50,000+',
    description:
      'A fully customised digital project for ambitious ideas, complex requirements and tailored functionality.',
    features: [
      { text: 'Custom project architecture', included: true },
      { text: 'Advanced functionality', included: true },
      { text: 'Tailored UI and interactions', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Scope-based development', included: true },
    ],
    cta: 'Discuss Your Project',
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PricingCard({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect?: (tierId: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: -500, y: -500 });
  const shouldReduceMotion = !!useReducedMotion();

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease }}
      whileHover={shouldReduceMotion ? undefined : { y: -5 }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 sm:p-7',
        plan.featured
          ? 'liquid-glass-strong bg-white/[0.04] shadow-[0_24px_64px_rgba(0,0,0,0.9),0_0_40px_rgba(255,255,255,0.08)]'
          : 'border border-white/12 bg-white/[0.02] hover:border-white/32 hover:bg-white/[0.035] hover:shadow-[0_20px_54px_rgba(0,0,0,0.9)]'
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${spot.x}px ${spot.y}px, rgba(255,255,255,0.09), transparent 65%)`,
        }}
      />

      {plan.featured && plan.badge && (
        <div className="absolute top-0 right-0 rounded-bl-xl border-b border-l border-white/25 bg-white px-3.5 py-1.5 font-space-mono text-[11px] font-medium tracking-[0.14em] text-black">
          {plan.badge}
        </div>
      )}

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'font-space-mono text-[11.5px] tracking-[0.16em]',
              plan.featured ? 'text-white/90' : 'text-white/70'
            )}
          >
            PACKAGE / {plan.number}
          </span>
          <span className={cn('h-px w-8', plan.featured ? 'bg-white/55' : 'bg-white/25')} />
        </div>

        <div className="mt-6">
          <p className="font-body text-[13px] font-normal tracking-[0.01em] text-white/75">
            {plan.subtitle}
          </p>
          <h3 className="mt-1.5 font-heading text-3xl tracking-tight text-white lg:text-[2.15rem] xl:text-[2.35rem]">
            {plan.name}
          </h3>
        </div>

        <div className="mt-6 border-t border-white/15 pt-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-body text-[2.25rem] font-light leading-none tracking-[-0.04em] text-white tabular-nums xl:text-[2.55rem]">
              {plan.usd}
            </span>
            <span
              className={cn(
                'font-body text-sm font-medium tabular-nums',
                plan.featured ? 'text-white/90' : 'text-white/75'
              )}
            >
              {plan.inr}
            </span>
          </div>
          <p className="mt-2 font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/65">
            STARTING PRICE · ONE-TIME PROJECT
          </p>
        </div>

        <p className="mt-4 min-h-[72px] font-body text-[14px] font-normal leading-[1.6] text-white/80">
          {plan.description}
        </p>

        <button
          type="button"
          onClick={() => onSelect?.(plan.name.toLowerCase())}
          className={cn(
            'mt-6 flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-full px-5 font-body text-[13.5px] font-medium tracking-[0.01em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
            plan.featured
              ? 'bg-white text-black hover:bg-white/90'
              : 'liquid-glass-strong text-white hover:bg-white/15'
          )}
        >
          <span>{plan.cta}</span>
          <span
            aria-hidden="true"
            className="text-base transition-transform duration-300 group-hover:translate-x-1"
          >
            ↗
          </span>
        </button>
      </div>

      <div className="relative mt-7 border-t border-white/15 pt-5">
        <p className="mb-3.5 font-space-mono text-[11px] tracking-[0.15em] uppercase text-white/65">
          WHAT&apos;S INCLUDED
        </p>
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li
              key={feature.text}
              className={cn(
                'flex items-start gap-3 font-body text-[13px] font-normal leading-5',
                feature.included ? 'text-white/90' : 'text-white/60'
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]',
                  feature.included
                    ? plan.featured
                      ? 'border-white/75 text-white'
                      : 'border-white/45 text-white'
                    : 'border-white/25 text-white/60'
                )}
              >
                {feature.included ? '✓' : '–'}
              </span>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function PricingSection({ onSelectPackage }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="ll-section-seam relative w-full overflow-hidden bg-black py-20 text-white sm:py-28"
    >
      {/* Subtle monochrome grid texture & radial atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[540px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.065)_0%,transparent_70%)] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <div className="mb-5 flex items-center gap-3 font-space-mono text-[11.5px] tracking-[0.18em] text-white/75">
                <span aria-hidden="true" className="h-px w-6 bg-white/55" />
                INVESTMENT · 001
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2
                id="pricing-heading"
                className="font-heading text-[clamp(2.25rem,min(5vw,7.4dvh),4.75rem)] font-normal leading-[0.95] tracking-tight text-white"
              >
                Good work.
                <br />
                <span className="italic text-white/85">Clear investment.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="max-w-sm">
            <p className="font-body text-[14.5px] font-normal leading-7 text-white/80">
              No confusing packages or unnecessary extras. Just a clear starting point for creating
              a digital experience that works for your business.
            </p>
            <p className="mt-3 font-space-mono text-[11px] tracking-[0.16em] text-white/65">
              FOUR WAYS TO MOVE FORWARD ↘
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              onSelect={(tierId) => onSelectPackage?.('Pricing', tierId)}
            />
          ))}
        </div>

        <Reveal delay={0.18}>
          <div className="relative mt-8 border-t border-white/15 pt-6">
            <p className="font-body text-[13.5px] font-normal text-white/80">
              Every project is scoped around its goals and requirements.
            </p>
            <p className="mt-2.5 max-w-3xl font-body text-[12.5px] font-normal leading-relaxed text-white/65">
              All amounts shown are starting prices and represent one-time project costs. Final
              pricing depends on project scope, functionality and requirements. Domain registration,
              hosting, paid integrations and third-party services may be charged separately.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PricingSection;
