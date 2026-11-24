import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, MousePointer2 } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export function LaunchSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.35 });
  const shouldReduceMotion = !!useReducedMotion();
  const [status, setStatus] = useState<'Preparing' | 'Live'>(
    shouldReduceMotion ? 'Live' : 'Preparing'
  );
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setStatus('Live');
      return;
    }
    if (!isInView) return;

    const timer = window.setTimeout(() => {
      setStatus('Live');
    }, 1050);

    return () => window.clearTimeout(timer);
  }, [isInView, shouldReduceMotion]);

  const isLive = status === 'Live';

  return (
    <section
      id="launch"
      ref={sectionRef}
      aria-labelledby="launch-heading"
      className="relative w-full bg-[#050505] pb-24 pt-6 text-[#F0ECE7] md:pb-32 lg:pb-36"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 border border-[#292929] bg-[#08090D] p-6 md:p-12 lg:grid-cols-12 lg:gap-12 lg:p-14">
          {/* Left Copy */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-medium tracking-[0.14em] uppercase text-[#999999]">
                03 · Launch
              </span>
              <span aria-hidden="true" className="text-[#999999]/40">
                /
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-300 ${
                  isLive ? 'text-[#5cd69c]' : 'text-[#999999]'
                }`}
              >
                {isLive ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="inline-block h-1.5 w-1.5 bg-[#999999]" />
                )}
                <span>{status}</span>
              </span>
            </div>

            <h2
              id="launch-heading"
              className="mt-5 font-serif text-[clamp(2.5rem,4.6vw,4.2rem)] font-normal leading-[1.02] tracking-[-0.02em] text-[#F0ECE7] [text-wrap:balance]"
            >
              Ready for <span className="italic">the world.</span>
            </h2>

            <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.65] text-[#999999] md:text-[16px]">
              After testing, refinement and final checks, your website goes live — ready to
              introduce your business to the world.
            </p>

            {/* Launch sequence checklist */}
            <div className="mt-8 space-y-2.5 border-t border-[#292929] pt-6 text-[13px] text-[#999999]">
              <div className="flex items-center justify-between">
                <span>Performance &amp; responsiveness</span>
                <span className="text-[#F0ECE7]">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SEO &amp; metadata</span>
                <span className="text-[#F0ECE7]">Configured</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Deployment status</span>
                <span className={isLive ? 'text-[#5cd69c]' : 'text-[#F0ECE7]/70'}>{status}</span>
              </div>
            </div>
          </div>

          {/* Right Browser Launch Frame */}
          <div className="relative lg:col-span-7">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
              className="relative overflow-hidden border border-[#292929] bg-[#050505]"
            >
              {/* Browser Chrome */}
              <div className="flex items-center justify-between border-b border-[#292929] bg-[#0E1015] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#292929]" />
                  <span className="h-2 w-2 bg-[#292929]" />
                  <span className="h-2 w-2 bg-[#292929]" />
                </div>

                <div className="border border-[#292929] bg-[#08090D] px-4 py-1 text-[11px] text-[#999999]">
                  atelier-preview.launchlayer.in
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 text-[11px] font-medium transition-colors duration-300 ${
                      isLive
                        ? 'bg-[#163325] text-[#5cd69c]'
                        : 'bg-[#171717] text-[#999999]'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              {/* Featured Website Preview (shared with Plan Your Direction) */}
              <div className="relative aspect-[16/10] w-full bg-[#EFECE6] p-5 text-[#191816] sm:p-7">
                <div className="flex items-center justify-between border-b border-[#191816]/12 pb-3 text-[11px]">
                  <span className="font-serif text-lg leading-none">Kanso</span>
                  <div className="hidden gap-4 text-[#191816]/65 sm:flex">
                    <span>Works</span>
                    <span>Practice</span>
                    <span>Journal</span>
                  </div>
                  <span className="text-[#191816]/60">Kyoto · Zurich</span>
                </div>

                <div className="mt-4 grid h-[calc(100%-44px)] grid-cols-12 items-center gap-4">
                  <div className="col-span-5 flex h-full flex-col justify-between py-1">
                    <div>
                      <p className="text-[9.5px] uppercase tracking-[0.14em] text-[#191816]/55">
                        Architecture
                      </p>
                      <h3 className="mt-2 font-serif text-[22px] leading-[0.98] sm:text-[30px]">
                        Spaces shaped by <span className="italic">daylight</span> and silence.
                      </h3>
                    </div>

                    <div className="relative inline-flex w-fit items-center gap-2 border border-[#191816]/30 bg-[#191816] px-3 py-1.5 text-[10.5px] font-medium text-[#EFECE6]">
                      <span>Publish Live</span>
                      <motion.span
                        animate={
                          isLive && !shouldReduceMotion ? { y: [0, -2, 0], x: [0, 2, 0] } : undefined
                        }
                        transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </motion.span>
                    </div>
                  </div>

                  <div className="col-span-7 h-full overflow-hidden border border-[#191816]/12 bg-[#DDD7CC]">
                    {!imageError ? (
                      <img
                        src="/src/assets/images/project_kanso_architecture_1795538724169.jpg"
                        alt="Minimalist architectural pavilion beside a still reflecting pool"
                        referrerPolicy="no-referrer"
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#cfc8bb]" />
                    )}
                  </div>
                </div>

                {/* Animated Pointer Cursor gliding to the Publish Live action */}
                {!shouldReduceMotion && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ x: 260, y: 120, opacity: 0 }}
                    animate={
                      isInView
                        ? { x: [260, 125, 118], y: [120, 185, 185], opacity: [0, 1, 0.9] }
                        : undefined
                    }
                    transition={{ duration: 1.05, ease: EASE_EDITORIAL }}
                    className="pointer-events-none absolute top-0 left-0 z-20 hidden drop-shadow-md sm:block"
                  >
                    <MousePointer2 className="h-5 w-5 fill-[#050505] text-[#F0ECE7]" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
