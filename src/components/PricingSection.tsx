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

type Currency = 'USD' | 'INR';

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
      'A clean, thoughtfully designed single page for new ideas, individuals, and launches that want to make a strong first impression.',
    features: [
      { text: 'Custom one-page design', included: true },
      { text: 'Works on phone & desktop', included: true },
      { text: 'All your key sections', included: true },
      { text: 'Working contact form', included: true },
      { text: 'Basic Google search setup', included: true },
    ],
    cta: 'Start with Starter',
  },
  {
    number: '02',
    name: 'Business',
    subtitle: 'Built for growing teams',
    usd: '$599',
    inr: '₹44,999',
    description:
      'A complete multi-page website that explains what you offer, earns trust, and makes it easy for customers to reach out.',
    features: [
      { text: 'Multi-page website', included: true },
      { text: 'Custom look and feel', included: true },
      { text: 'Works on phone & desktop', included: true },
      { text: 'Contact and inquiry forms', included: true },
      { text: 'Essential search setup', included: true },
    ],
    cta: 'Choose Business',
  },
  {
    number: '03',
    name: 'Signature',
    subtitle: 'For brands that want to stand out',
    usd: '$1,199',
    inr: '₹89,999',
    description:
      'A custom website with distinct personality, refined typography, and smooth, memorable interactions.',
    features: [
      { text: 'Completely custom design', included: true },
      { text: 'Thoughtful interactions', included: true },
      { text: 'Smooth custom animations', included: true },
      { text: 'Works on phone & desktop', included: true },
      { text: 'Fast loading & search setup', included: true },
    ],
    featured: true,
    badge: 'Most popular',
    cta: 'Choose Signature',
  },
  {
    number: '04',
    name: 'Bespoke',
    subtitle: 'Built around your ideas',
    usd: '$2,000+',
    inr: '₹1,50,000+',
    description:
      'A tailored website or online store built from scratch for complex features, custom tools, or ambitious launches.',
    features: [
      { text: 'Custom site structure', included: true },
      { text: 'Tailored features & tools', included: true },
      { text: 'Custom interactions & motion', included: true },
      { text: 'Third-party integrations', included: true },
      { text: 'Built to your exact scope', included: true },
    ],
    cta: 'Talk about your project',
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

const PRINT_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.85'/%3E%3C/svg%3E")`;

function PricingCard({
  plan,
  primaryCurrency,
  onSelect,
}: {
  plan: Plan;
  primaryCurrency: Currency;
  onSelect?: (tierId: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: -500, y: -500 });
  const shouldReduceMotion = !!useReducedMotion();

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || e.pointerType === 'touch') return;
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
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -6,
              scale: 1.018,
              transition: { type: 'spring', stiffness: 420, damping: 30, mass: 0.7 },
            }
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: 0.996,
              transition: { type: 'spring', stiffness: 520, damping: 34 },
            }
      }
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[26px] p-6 will-change-transform transition-[border-color,background-color,box-shadow] duration-300 sm:p-7',
        plan.featured
          ? 'apple-liquid-glass shadow-[0_24px_64px_rgba(0,0,0,0.9),0_0_40px_rgba(255,255,255,0.08)] hover:shadow-[0_32px_78px_rgba(0,0,0,0.95),0_0_52px_rgba(255,255,255,0.13)]'
          : 'border border-white/14 bg-white/[0.025] hover:border-white/32 hover:bg-white/[0.04] hover:shadow-[0_26px_64px_rgba(0,0,0,0.92)]'
      )}
    >
      {/* Editorial Print Paper Micro-Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay transition-opacity duration-500 group-hover:opacity-[0.06]"
        style={{ backgroundImage: PRINT_GRAIN_BG }}
      />

      {/* Soft Editorial Light-Leak Wash (warm pearl + cool ice-blue bleed along card edges) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(125% 85% at 96% -8%, rgba(255, 240, 222, 0.14) 0%, rgba(255, 224, 196, 0.045) 36%, transparent 66%), radial-gradient(95% 75% at 6% 106%, rgba(235, 238, 245, 0.09) 0%, transparent 58%), linear-gradient(128deg, rgba(255,255,255,0.065) 0%, transparent 32%, transparent 72%, rgba(255,244,232,0.04) 100%)',
        }}
      />

      {/* Top Foil Edge Hairline Illumination */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Pointer-Follow Local Light Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background: `radial-gradient(360px circle at ${spot.x}px ${spot.y}px, rgba(255,255,255,0.085), transparent 64%)`,
        }}
      />

      {plan.featured && plan.badge && (
        <div className="absolute top-0 right-0 z-10 rounded-bl-xl border-b border-l border-white/25 bg-white px-3.5 py-1.5 font-space-mono text-[11px] font-medium tracking-[0.14em] text-black transition-transform duration-300 group-hover:scale-[1.02]">
          {plan.badge}
        </div>
      )}

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'font-space-mono text-[11.5px] tracking-[0.16em] transition-colors duration-300',
              plan.featured ? 'text-white/90' : 'text-white/70 group-hover:text-white/90'
            )}
          >
            Option {plan.number}
          </span>
          <span
            className={cn(
              'h-px w-8 origin-right transition-all duration-300 ease-out group-hover:w-14',
              plan.featured
                ? 'bg-white/55 group-hover:bg-white/85'
                : 'bg-white/25 group-hover:bg-white/60'
            )}
          />
        </div>

        <div className="mt-6">
          <p className="font-body text-[13px] font-normal tracking-[0.01em] text-white/75 transition-colors duration-300 group-hover:text-white/90">
            {plan.subtitle}
          </p>
          <h3 className="mt-1.5 font-heading text-3xl tracking-tight text-white transition-transform duration-300 ease-out group-hover:translate-x-0.5 lg:text-[2.15rem] xl:text-[2.35rem]">
            {plan.name}
          </h3>
        </div>

        <div className="mt-6 border-t border-white/15 pt-5 transition-colors duration-300 group-hover:border-white/25">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-body text-[2.25rem] font-light leading-none tracking-[-0.04em] text-white tabular-nums xl:text-[2.55rem]">
              {primaryCurrency === 'USD' ? plan.usd : plan.inr}
            </span>
            <span
              className={cn(
                'font-body text-sm font-medium tabular-nums transition-colors duration-300',
                plan.featured ? 'text-white/90' : 'text-white/75 group-hover:text-white/90'
              )}
            >
              {primaryCurrency === 'USD' ? plan.inr : plan.usd}
            </span>
          </div>
          <p className="mt-2 font-space-mono text-[11px] tracking-[0.12em] uppercase text-white/75">
            Starting price · One-time fee
          </p>
        </div>

        <p className="mt-4 min-h-[72px] font-body text-[14px] font-normal leading-[1.6] text-white/85">
          {plan.description}
        </p>

        <button
          type="button"
          onClick={() => onSelect?.(plan.name.toLowerCase())}
          aria-label={`${plan.cta} — ${plan.name} website starting at ${plan.usd} or ${plan.inr}`}
          className={cn(
            'group/btn mt-6 flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-full px-5 font-body text-[13.5px] font-medium tracking-[0.01em] transition-all duration-300 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
            plan.featured
              ? 'bg-white text-black hover:bg-white/95 group-hover:shadow-[0_8px_24px_rgba(255,255,255,0.16)]'
              : 'apple-liquid-pill text-white hover:scale-[1.015]'
          )}
        >
          <span>{plan.cta}</span>
          <span
            aria-hidden="true"
            className="text-base transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
          >
            ↗
          </span>
        </button>
      </div>

      <div className="relative mt-7 border-t border-white/15 pt-5 transition-colors duration-300 group-hover:border-white/25">
        <p className="mb-3.5 font-space-mono text-[11px] tracking-[0.15em] uppercase text-white/75">
          What you get
        </p>
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li
              key={feature.text}
              style={shouldReduceMotion ? undefined : { transitionDelay: `${idx * 28}ms` }}
              className={cn(
                'flex items-start gap-3 font-body text-[13px] font-normal leading-5 transition-[transform,color] duration-300 ease-out group-hover:translate-x-0.5',
                feature.included ? 'text-white/90 group-hover:text-white' : 'text-white/60'
              )}
            >
              <span
                aria-hidden="true"
                style={shouldReduceMotion ? undefined : { transitionDelay: `${idx * 28}ms` }}
                className={cn(
                  'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors duration-300',
                  feature.included
                    ? plan.featured
                      ? 'border-white/75 text-white group-hover:border-white group-hover:bg-white/10'
                      : 'border-white/45 text-white group-hover:border-white/80 group-hover:bg-white/[0.06]'
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
  const [primaryCurrency, setPrimaryCurrency] = useState<Currency>('USD');

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="ll-section-seam relative w-full overflow-hidden bg-black py-14 text-white sm:py-20 md:py-24"
    >
      {/* Subtle monochrome grid texture & radial atmosphere (pure gradient, zero blur pass) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[540px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.015)_44%,transparent_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 md:mb-14 md:flex-row md:items-end">
          <div className="w-full max-w-2xl">
            <Reveal>
              <div className="mb-4 flex items-center justify-between gap-3 font-space-mono text-[11.5px] tracking-[0.16em] text-white/75 md:justify-start">
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="hidden h-px w-6 bg-white/55 md:inline-block" />
                  Pricing · One-time projects
                </span>
                <span className="md:hidden text-white/75">Fixed price</span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2
                id="pricing-heading"
                className="font-heading text-[clamp(2.15rem,min(4.6vw,6.8dvh),4.25rem)] font-normal leading-[0.96] tracking-tight text-white"
              >
                Good work.
                <br />
                <span className="italic text-white/90">Clear investment.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="max-w-sm">
            <p className="font-body text-[14.5px] font-normal leading-7 text-white/85">
              No confusing tiers or surprise add-ons—just clear starting prices for a website that
              helps your business grow.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label="Primary display currency"
                className="apple-liquid-pill inline-flex items-center p-1"
              >
                {(['USD', 'INR'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    aria-pressed={primaryCurrency === curr}
                    onClick={() => setPrimaryCurrency(curr)}
                    className={cn(
                      'min-h-[34px] rounded-full px-3.5 py-1 font-space-mono text-[11px] tracking-[0.14em] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                      primaryCurrency === curr
                        ? 'bg-white text-black font-medium shadow-[0_2px_10px_rgba(255,255,255,0.22)]'
                        : 'text-white/75 hover:text-white'
                    )}
                  >
                    {curr}
                  </button>
                ))}
              </div>
              <p className="hidden font-space-mono text-[11px] tracking-[0.16em] text-white/75 md:block">
                Four ways ↘
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              primaryCurrency={primaryCurrency}
              onSelect={(tierId) => onSelectPackage?.('Pricing', tierId)}
            />
          ))}
        </div>

        <Reveal delay={0.18}>
          <div className="relative mt-9 border-t border-white/15 pt-6">
            <p className="font-body text-[13.5px] font-normal text-white/85">
              Every project is quoted based on what you actually need.
            </p>
            <p className="mt-2.5 max-w-3xl font-body text-[12.5px] font-normal leading-relaxed text-white/75">
              All prices above are starting points for one-time projects. Your final quote depends
              on pages, features, and timeline. Domain names, hosting, and paid third-party tools
              are billed separately.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PricingSection;
