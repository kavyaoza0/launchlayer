import { ArrowRight } from 'lucide-react';

interface DesignBuildSlideProps {
  isActive: boolean;
}

export function DesignBuildSlide({ isActive: _isActive }: DesignBuildSlideProps) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-black p-6 font-body text-white sm:p-10 lg:px-14 lg:py-10">
      {/* Soft monochrome radial aura */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[380px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.055)_0%,transparent_74%)] blur-[96px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-2 border-b border-white/12 pb-4">
        <div className="flex items-center justify-between text-[10px] font-medium tracking-[0.14em] uppercase text-white/50 sm:text-[11px]">
          <span className="text-white/80">03 · DESIGN &amp; BUILD</span>
          <span>CONCEPT TO CODE</span>
        </div>
        <div className="flex flex-col justify-between gap-2.5 lg:flex-row lg:items-end">
          <h2 className="font-heading text-[clamp(1.85rem,3.6vw,3.15rem)] leading-[0.95] tracking-tight text-white">
            From an idea to something <span className="italic text-white">tangible</span>.
          </h2>
          <p className="max-w-[48ch] text-[12px] font-light leading-[1.55] text-white/60 sm:text-[13.5px]">
            With the direction established, we turn your vision into a carefully designed and fully
            developed digital experience.
          </p>
        </div>
      </div>

      {/* Two Interconnected Stages */}
      <div className="relative z-10 my-auto grid flex-1 grid-cols-1 items-stretch gap-3.5 py-4 sm:grid-cols-11 sm:gap-3 sm:py-5">
        {/* Stage 1: DESIGN */}
        <div className="ll-glow-border flex flex-col justify-between rounded-xl border bg-white/[0.02] p-4 sm:col-span-5 sm:p-5 lg:p-6">
          <div>
            <div className="flex items-center justify-between text-[10px] tracking-[0.14em] uppercase text-white/50 sm:text-[11px]">
              <span className="font-semibold text-white">DESIGN</span>
              <span className="text-white/75">Art Direction</span>
            </div>
            <p className="mt-2 text-[12px] font-light leading-[1.55] text-white/60 sm:text-[13px]">
              Every layout, typeface, image and interaction has a purpose. We shape a visual
              experience that feels right for your brand.
            </p>
          </div>

          {/* Interface composition */}
          <div className="mt-4 flex flex-1 flex-col justify-between rounded-lg border border-white/12 bg-[#0c0c0c] p-3.5 sm:p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[9px] tracking-widest uppercase text-white/50">
              <span>Grid · 12 Col</span>
              <span className="text-white/80">Aa Serif</span>
            </div>

            <div className="my-3 grid grid-cols-12 items-center gap-3">
              <div className="col-span-7 space-y-2">
                <p className="font-heading text-[20px] leading-[0.95] text-white sm:text-[25px]">
                  Quiet <span className="italic">craft</span> &amp; rhythm
                </p>
                <div className="h-1 w-12 bg-white/50" />
                <div className="h-1 w-16 bg-white/15" />
              </div>

              <div className="col-span-5 h-20 overflow-hidden border border-white/15 bg-black sm:h-28 lg:h-32">
                <img
                  src="/src/assets/images/project_kanso_architecture_1795538724169.jpg"
                  alt="Design composition block"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-85"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[9px] text-white/50">
              <span className="inline-block h-2.5 w-2.5 border border-white/40 bg-black" />
              <span className="inline-block h-2.5 w-2.5 border border-white/40 bg-white" />
              <span className="inline-block h-2.5 w-2.5 bg-white/45" />
              <span className="inline-block h-2.5 w-2.5 bg-white/20" />
              <span className="ml-auto tracking-wider uppercase">Tokens</span>
            </div>
          </div>
        </div>

        {/* Connecting Arrow */}
        <div className="flex items-center justify-center sm:col-span-1">
          <div className="liquid-glass-strong flex h-10 w-10 items-center justify-center rounded-full">
            <ArrowRight className="h-4 w-4 rotate-90 text-white sm:rotate-0" />
          </div>
        </div>

        {/* Stage 2: BUILD */}
        <div className="ll-glow-border flex flex-col justify-between rounded-xl border bg-white/[0.02] p-4 sm:col-span-5 sm:p-5 lg:p-6">
          <div>
            <div className="flex items-center justify-between text-[10px] tracking-[0.14em] uppercase text-white/50 sm:text-[11px]">
              <span className="font-semibold text-white">BUILD</span>
              <span className="text-white/75">Engineering</span>
            </div>
            <p className="mt-2 text-[12px] font-light leading-[1.55] text-white/60 sm:text-[13px]">
              Once the direction is right, we bring it to life with responsive development,
              thoughtful functionality and attention to detail.
            </p>
          </div>

          {/* Browser preview with subtle construction lines & code-inspired details */}
          <div className="mt-4 flex flex-1 flex-col justify-between rounded-lg border border-white/15 bg-black p-3.5 sm:p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/25" />
                <span className="h-2 w-2 rounded-full bg-white/55" />
                <span className="h-2 w-2 rounded-full bg-white/85" />
              </div>
              <span className="font-space-mono text-[9px] text-white/50">1440px · 390px</span>
            </div>

            <div className="relative my-3 flex-1 overflow-hidden border border-dashed border-white/20 bg-white/[0.03] p-3 sm:p-4">
              {/* Construction guides */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-1/2 w-px border-l border-dashed border-white/18"
              />
              <div className="flex h-full flex-col justify-between gap-2">
                <span className="font-space-mono text-[9px] text-white/55">
                  &lt;main class=&quot;editorial&quot;&gt;
                </span>
                <div className="my-1 flex items-center gap-3">
                  <div className="h-11 flex-1 border border-white/15 bg-white/92 p-2 sm:h-14">
                    <div className="h-1.5 w-12 bg-black/80" />
                    <div className="mt-1.5 h-1.5 w-20 bg-black/30" />
                  </div>
                  <div className="h-11 w-11 border border-white/35 bg-white/10 sm:h-14 sm:w-14" />
                </div>
                <span className="font-space-mono text-[9px] text-white/75">
                  requestAnimationFrame · 60fps
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] tracking-wider uppercase text-white/50">
              <span>Responsive</span>
              <span className="text-white/85">Accessible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom meta */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/12 pt-3 text-[10px] tracking-[0.12em] uppercase text-white/45">
        <span>Visual Systems &amp; Production Code</span>
        <span>Cross-Device Craft</span>
      </div>
    </div>
  );
}
