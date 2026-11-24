import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { EnquiryTopic } from './Navbar';

interface ContactSectionProps {
  onStartProject: (topic: EnquiryTopic) => void;
}

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export function ContactSection({ onStartProject }: ContactSectionProps) {
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full border-t border-[#F0ECE7]/10 bg-[#08090D] py-28 text-[#F0ECE7] md:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
          className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12"
        >
          <div className="lg:col-span-8">
            <p className="mb-5 text-[12px] font-medium tracking-[0.14em] uppercase text-[#999999]">
              Contact
            </p>
            <h2
              id="contact-heading"
              className="font-serif text-[clamp(3rem,6.5vw,5.75rem)] font-normal leading-[0.98] tracking-[-0.02em] text-[#F0ECE7] [text-wrap:balance]"
            >
              Have something <span className="italic">in mind?</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-[15.5px] leading-[1.65] text-[#999999] md:text-[17px]">
              Tell us a little about your business and what you&apos;d like to build. We&apos;ll
              take it from there.
            </p>

            {/* Distinctive expanding-ring CTA */}
            <div className="mt-10">
              <button
                type="button"
                onClick={() => onStartProject('Contact')}
                className="group relative inline-flex items-center gap-4 border border-[#F0ECE7]/25 bg-[#050505] px-7 py-4 text-[14px] font-medium text-[#F0ECE7] transition-colors duration-200 hover:border-[#9F3035] hover:bg-[#9F3035] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
              >
                <span>Start a Project</span>
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#F0ECE7]/30 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-[#F0ECE7]">
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-6 border-t border-[#F0ECE7]/12 pt-8 text-[14px] lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <div>
              <span className="block text-[11px] uppercase tracking-[0.12em] text-[#999999]">
                Email
              </span>
              <a
                href="mailto:hello@launchlayer.in"
                className="mt-1.5 inline-block border-b border-[#F0ECE7]/25 pb-0.5 text-[#F0ECE7] transition-colors duration-150 hover:border-[#F0ECE7]"
              >
                hello@launchlayer.in
              </a>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.12em] text-[#999999]">
                Location
              </span>
              <span className="mt-1.5 block text-[#F0ECE7]">Ahmedabad, India</span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.12em] text-[#999999]">
                Availability
              </span>
              <span className="mt-1.5 block text-[#F0ECE7]">Working worldwide</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
