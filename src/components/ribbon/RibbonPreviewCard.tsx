import { useState } from 'react';
import type { RibbonProject } from './ribbonProjects';

interface RibbonPreviewCardProps {
  project: RibbonProject;
}

function SafeRibbonImage({
  src,
  alt,
  fallbackBg,
  className = '',
}: {
  src?: string;
  alt?: string;
  fallbackBg: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center p-3 ${className}`}
        style={{ background: fallbackBg }}
      >
        <span className="text-center text-[10px] tracking-[0.14em] uppercase text-white/45">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover select-none ${className}`}
    />
  );
}

export function RibbonPreviewCard({ project }: RibbonPreviewCardProps) {
  switch (project.theme) {
    case 'kanso':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#EFECE6] p-3.5 text-[#191816] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#191816]/12 pb-2 text-[9.5px]">
            <span className="font-serif text-[15px] leading-none">Kanso</span>
            <div className="hidden items-center gap-3.5 text-[#191816]/60 sm:flex">
              <span>Works</span>
              <span>Practice</span>
              <span>Journal</span>
            </div>
            <span className="text-[#191816]/55">Kyoto · Zurich</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-center gap-3.5 pt-3">
            <div className="col-span-5 flex h-full flex-col justify-between py-0.5">
              <div>
                <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#191816]/50">
                  Spatial Monograph
                </p>
                <h3 className="mt-1 font-serif text-[19px] leading-[0.98] tracking-[-0.02em] sm:text-[24px]">
                  Spaces shaped by <span className="italic">daylight</span>.
                </h3>
              </div>
              <div className="space-y-1.5">
                <p className="hidden text-[10px] leading-snug text-[#191816]/65 sm:block">
                  Timber, poured concrete, and calm water courts composed for quiet permanence.
                </p>
                <span className="inline-block border-b border-[#191816]/50 pb-0.5 text-[9.5px] font-medium">
                  View Monograph
                </span>
              </div>
            </div>
            <div className="col-span-7 h-full overflow-hidden border border-[#191816]/12 bg-[#DDD7CC]">
              <SafeRibbonImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #d7d0c3, #b5ab99)"
              />
            </div>
          </div>
        </div>
      );

    case 'vespera':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#0E1913] p-3.5 text-[#F3EDE2] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#F3EDE2]/12 pb-2 text-[9.5px]">
            <span className="font-serif text-[15px] tracking-wide">VESPERA</span>
            <div className="hidden items-center gap-3.5 text-[#F3EDE2]/60 sm:flex">
              <span>Formulations</span>
              <span>Botanicals</span>
              <span>Ritual</span>
            </div>
            <span className="border border-[#C47F52]/45 px-2 py-0.5 text-[8.5px] text-[#E4A97E]">
              Bag (0)
            </span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-stretch gap-3 pt-3">
            <div className="col-span-6 overflow-hidden border border-[#F3EDE2]/10 bg-[#15241B]">
              <SafeRibbonImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #16261d, #0a120d)"
              />
            </div>
            <div className="col-span-6 flex flex-col justify-between border border-[#F3EDE2]/10 bg-[#142219] p-3">
              <div>
                <p className="text-[8.5px] tracking-[0.12em] uppercase text-[#C47F52]">
                  No. 02 · Evening Oil
                </p>
                <h3 className="mt-1 font-serif text-[17px] leading-[1.06] sm:text-[21px]">
                  Cold-Pressed Neroli Elixir
                </h3>
              </div>
              <div className="space-y-2 border-t border-[#F3EDE2]/10 pt-2">
                <div className="flex items-baseline justify-between text-[10px] tabular-nums">
                  <span className="text-[#F3EDE2]/60">30 ml / 1.0 oz</span>
                  <span className="font-medium">$84</span>
                </div>
                <div className="bg-[#C47F52] py-1 text-center text-[9.5px] font-medium text-[#0E1913]">
                  Add to Bag
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'meridian':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#090C11] p-3.5 text-[#E8EEF7] sm:p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[9.5px]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-[#34D399]" />
              <span className="font-semibold tracking-tight text-white">Meridian</span>
            </div>
            <div className="hidden items-center gap-3.5 text-[#7E8B9E] sm:flex">
              <span className="text-[#E8EEF7]">Treasury</span>
              <span>FX Desk</span>
              <span>Settlements</span>
            </div>
            <span className="font-space-mono text-[8.5px] text-[#7E8B9E] tabular-nums">UTC 14:20</span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-3 pt-3">
            <div className="col-span-7 flex flex-col justify-between border border-white/10 bg-[#111620] p-3">
              <div>
                <p className="text-[8.5px] tracking-[0.12em] uppercase text-[#7E8B9E]">
                  Consolidated Liquidity
                </p>
                <p className="mt-1 text-[20px] font-semibold tracking-tight text-white tabular-nums sm:text-[24px]">
                  $48,920,410<span className="text-[#7E8B9E]">.00</span>
                </p>
                <p className="mt-0.5 text-[9.5px] text-[#34D399] tabular-nums">
                  +2.41% net inflow · 3 active corridors
                </p>
              </div>
              <svg viewBox="0 0 220 48" className="mt-2 h-10 w-full overflow-visible">
                <defs>
                  <linearGradient id="meridianRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 40 L35 34 L70 37 L105 22 L145 25 L180 12 L220 6 L220 48 L0 48 Z"
                  fill="url(#meridianRibbonGrad)"
                />
                <path
                  d="M0 40 L35 34 L70 37 L105 22 L145 25 L180 12 L220 6"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div className="col-span-5 flex flex-col justify-between border border-white/10 bg-[#0D1118] p-2.5 text-[9.5px] tabular-nums">
              <div className="border-b border-white/8 pb-1.5 text-[#7E8B9E]">Active Reserves</div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#E8EEF7]">USD Core</span>
                <span className="text-white">$24.18M</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#E8EEF7]">SEPA EUR</span>
                <span className="text-white">€16.41M</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/8 pt-1.5 text-[#34D399]">
                <span>Clearing</span>
                <span>Instant</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'soraia':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#E4E5E7] p-3.5 text-[#151618] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#151618]/14 pb-2 text-[9.5px] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D93829]" />
              <span className="tracking-tight">SORAIA ACOUSTICS</span>
            </div>
            <span className="font-space-mono text-[8.5px] text-[#151618]/60 tabular-nums">
              SERIES R-01
            </span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-stretch gap-3 pt-3">
            <div className="col-span-5 flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-[23px]">
                  Reference Monitor 01
                </h3>
                <p className="mt-2 hidden text-[10px] leading-snug text-[#151618]/65 sm:block">
                  CNC-machined anodized enclosure tuned for studio near-field clarity.
                </p>
              </div>
              <div className="space-y-1.5 border-t border-[#151618]/14 pt-2 text-[9px] tabular-nums text-[#151618]/75">
                <div className="flex justify-between">
                  <span>Response</span>
                  <span>38 Hz – 28 kHz</span>
                </div>
                <div className="bg-[#D93829] py-1 text-center text-[9.5px] font-medium text-white">
                  Reserve Edition
                </div>
              </div>
            </div>
            <div className="col-span-7 overflow-hidden border border-[#151618]/14 bg-[#1C1D20]">
              <SafeRibbonImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #27292e, #151618)"
              />
            </div>
          </div>
        </div>
      );

    case 'solis':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#F4EFE8] p-3.5 text-[#221E1A] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#221E1A]/12 pb-2 text-[9.5px]">
            <span className="font-serif text-[15px] tracking-tight">Solis Interiors</span>
            <div className="hidden items-center gap-3.5 text-[#221E1A]/60 sm:flex">
              <span>Residences</span>
              <span>Objects</span>
              <span>Atelier</span>
            </div>
            <span className="text-[#785E45]">Milan · Mallorca</span>
          </div>

          <div className="relative mt-2.5 flex-1 overflow-hidden border border-[#221E1A]/12 bg-[#DDD4C7]">
            <SafeRibbonImage
              src={project.image}
              alt={project.imageAlt}
              fallbackBg="linear-gradient(135deg, #e0d6c8, #bcae9c)"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1612]/80 via-[#1A1612]/30 to-transparent p-3 text-[#F7F3ED]">
              <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#E4D1B9]">
                Limestone &amp; Travertine Study
              </p>
              <h3 className="mt-0.5 font-serif text-[18px] leading-tight sm:text-[22px]">
                Quiet Mediterranean Living
              </h3>
            </div>
          </div>
        </div>
      );

    case 'vance':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#111215] p-3.5 text-[#ECEAE5] sm:p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[9.5px]">
            <span className="font-medium tracking-[0.06em] uppercase">Vance &amp; Hale</span>
            <div className="hidden items-center gap-3.5 text-[#9C9EA4] sm:flex">
              <span>Advisory</span>
              <span>Capital</span>
              <span>Research</span>
            </div>
            <span className="border border-white/20 px-2 py-0.5 text-[8.5px]">London</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-center gap-3.5 pt-3">
            <div className="col-span-6 flex h-full flex-col justify-between">
              <div>
                <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#C9A87C]">
                  Industrial Practice
                </p>
                <h3 className="mt-1 font-serif text-[18px] leading-[1.04] sm:text-[22px]">
                  Long-horizon stewardship for founders.
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-2 text-[9px] tabular-nums text-[#9C9EA4]">
                <div>
                  <span className="block text-[13px] font-medium text-[#ECEAE5]">18</span>
                  <span>Partner offices</span>
                </div>
                <div>
                  <span className="block text-[13px] font-medium text-[#ECEAE5]">2014</span>
                  <span>Established</span>
                </div>
              </div>
            </div>
            <div className="col-span-6 h-full overflow-hidden border border-white/10 bg-[#1B1C20]">
              <SafeRibbonImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #25272d, #111215)"
              />
            </div>
          </div>
        </div>
      );

    case 'sorel':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#18191B] p-3.5 text-[#F4F2EE] sm:p-5">
          <div className="flex items-center justify-between border-b border-white/12 pb-2 text-[9.5px]">
            <span className="font-serif text-[16px] italic tracking-tight">Atelier Sorel</span>
            <span className="text-[#A5A7AC]">Autumn / Winter Collection</span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-3 pt-2.5">
            <div className="col-span-8 overflow-hidden border border-white/10 bg-[#232528]">
              <SafeRibbonImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #2e3034, #17181a)"
              />
            </div>
            <div className="col-span-4 flex flex-col justify-between bg-[#1F2124] p-2.5 border border-white/10">
              <div>
                <p className="text-[8px] tracking-[0.14em] uppercase text-[#D6B185]">Look 04</p>
                <h3 className="mt-1 font-serif text-[16px] leading-tight">
                  Double-Faced Merino Overcoat
                </h3>
              </div>
              <div className="space-y-1.5 border-t border-white/10 pt-2 text-[9px]">
                <p className="text-[#A5A7AC]">Tailored in Antwerp</p>
                <div className="bg-[#F4F2EE] py-1 text-center font-medium text-[#18191B]">
                  View Lookbook
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'kronos':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#0B0B0D] p-3.5 text-[#EDE8E0] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#D99B52]/20 pb-2 text-[9.5px]">
            <span className="font-space-mono text-[10.5px] tracking-[0.18em] uppercase text-[#E4B272]">
              KRONOS
            </span>
            <div className="hidden items-center gap-3.5 text-[#9B968F] sm:flex">
              <span>Calibres</span>
              <span>Chronographs</span>
              <span>Atelier</span>
            </div>
            <span className="text-[#E4B272]">Geneva</span>
          </div>

          <div className="relative mt-2.5 flex-1 overflow-hidden border border-[#D99B52]/20 bg-[#141417]">
            <SafeRibbonImage
              src={project.image}
              alt={project.imageAlt}
              fallbackBg="linear-gradient(135deg, #1b1a17, #0b0b0d)"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/85 via-[#0B0B0D]/30 to-transparent p-3.5 flex flex-col justify-end">
              <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#D99B52]">
                Calibre 09 · Automatic
              </p>
              <h3 className="mt-0.5 font-serif text-[20px] leading-none text-[#F4EFE6]">
                Slate Dial Chronograph
              </h3>
            </div>
          </div>
        </div>
      );

    case 'forma':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#F7F4EE] p-3.5 text-[#171513] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#171513]/12 pb-2 text-[9.5px]">
            <span className="font-medium tracking-tight">FORMA STUDIO 04</span>
            <span className="text-[#171513]/55">Ceramic &amp; Tactile Objects</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-stretch gap-3 pt-3">
            <div className="col-span-6 overflow-hidden border border-[#171513]/12 bg-[#E5DFD5]">
              <SafeRibbonImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #e5dfd5, #c8bfb0)"
              />
            </div>
            <div className="col-span-6 flex flex-col justify-between py-0.5">
              <div>
                <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#9A4E36]">
                  Studio Portfolio
                </p>
                <h3 className="mt-1 font-serif text-[20px] leading-[1] tracking-[-0.02em]">
                  Raw clay, ash glaze &amp; open kiln forms.
                </h3>
              </div>
              <div className="space-y-1 border-t border-[#171513]/12 pt-2 text-[9.5px] text-[#171513]/70">
                <div className="flex justify-between">
                  <span>Vessel Series II</span>
                  <span className="tabular-nums">2026</span>
                </div>
                <div className="flex justify-between">
                  <span>Exhibition Notes</span>
                  <span className="underline">Explore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'stratum':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#080D17] p-3.5 text-[#E5ECF6] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#3B82F6]/20 pb-2 text-[9.5px]">
            <span className="font-semibold tracking-tight text-white">Stratum Cloud</span>
            <div className="hidden items-center gap-3 text-[#8294B0] sm:flex">
              <span className="text-[#93C5FD]">Deployments</span>
              <span>Edge Nodes</span>
              <span>Logs</span>
            </div>
            <span className="bg-[#2563EB] px-2 py-0.5 text-[8.5px] font-medium text-white">
              Deploy
            </span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-2.5 pt-2.5">
            <div className="col-span-4 flex flex-col justify-between border border-white/10 bg-[#0E1525] p-2.5 text-[9px]">
              <span className="text-[#8294B0]">Regions</span>
              <div className="space-y-1.5 tabular-nums">
                <div className="flex justify-between">
                  <span>fra-01</span>
                  <span className="text-[#60A5FA]">11 ms</span>
                </div>
                <div className="flex justify-between">
                  <span>sin-02</span>
                  <span className="text-[#60A5FA]">18 ms</span>
                </div>
                <div className="flex justify-between">
                  <span>iad-04</span>
                  <span className="text-[#60A5FA]">14 ms</span>
                </div>
              </div>
            </div>

            <div className="col-span-8 flex flex-col justify-between border border-white/10 bg-[#0E1525] p-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[8.5px] uppercase tracking-[0.12em] text-[#8294B0]">
                    Edge Throughput
                  </p>
                  <p className="mt-0.5 text-[18px] font-semibold text-white tabular-nums">
                    142.8k req/s
                  </p>
                </div>
                <span className="text-[9px] text-[#60A5FA] tabular-nums">99.98% healthy</span>
              </div>
              <div className="grid h-14 grid-cols-12 items-end gap-1 pt-2">
                {[38, 52, 46, 68, 61, 79, 72, 88, 84, 94, 89, 96].map((h, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-t from-[#1D4ED8] to-[#60A5FA]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 'monograph':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#EAE3D5] p-3.5 text-[#141311] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#141311]/18 pb-2 text-[9px] tracking-[0.1em] uppercase">
            <span className="font-semibold">Monograph Press</span>
            <span>Issue 11 · Spatial Type</span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-3 pt-2.5">
            <div className="col-span-7 overflow-hidden border border-[#141311]/20 bg-[#1A1917]">
              <SafeRibbonImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #272522, #11100e)"
              />
            </div>
            <div className="col-span-5 flex flex-col justify-between border-l border-[#141311]/15 pl-3">
              <div>
                <p className="font-space-mono text-[8.5px] text-[#8F342A]">ESSAY 04</p>
                <h3 className="mt-1 font-serif text-[19px] leading-[0.98] tracking-[-0.02em]">
                  Architecture of Printed Rhythm
                </h3>
              </div>
              <p className="hidden text-[9.5px] leading-snug text-[#141311]/70 sm:block">
                An interactive broadsheet exploring modular grids, ink density, and light.
              </p>
              <span className="font-space-mono text-[8.5px] uppercase tracking-[0.12em] underline">
                Read Issue
              </span>
            </div>
          </div>
        </div>
      );

    case 'tala':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#1A1310] p-3.5 text-[#F2E9DC] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#F2E9DC]/14 pb-2 text-[9.5px]">
            <span className="text-[#F2E9DC]/65">Menu</span>
            <span className="font-serif text-[16px] tracking-wide">Tala &amp; Co.</span>
            <span className="text-[#C06342]">Reserve</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-stretch gap-3 pt-3">
            <div className="col-span-7 overflow-hidden border border-[#F2E9DC]/12 bg-[#261C18]">
              <SafeRibbonImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #2a1e18, #140e0c)"
              />
            </div>
            <div className="col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-[8.5px] uppercase tracking-[0.12em] text-[#C06342]">
                  Autumn Tasting
                </p>
                <h3 className="mt-1 font-serif text-[18px] leading-[1.04]">
                  Fire, grain &amp; <span className="italic">late harvest</span>.
                </h3>
              </div>
              <div className="space-y-1 border-y border-[#F2E9DC]/12 py-1.5 text-[9px] text-[#F2E9DC]/75">
                <p>01 · Hearth sourdough</p>
                <p>02 · Charred leek emulsion</p>
              </div>
              <div className="border border-[#F2E9DC]/25 py-1 text-center text-[9.5px]">
                Book a Table
              </div>
            </div>
          </div>
        </div>
      );

    case 'norden':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#070A0F] p-3.5 text-[#E0E6F0] sm:p-5">
          <div className="flex items-center justify-between border-b border-white/12 pb-2 text-[9.5px]">
            <span className="font-semibold tracking-[0.14em] uppercase">NORDEN</span>
            <div className="hidden items-center gap-3.5 text-[#E0E6F0]/60 sm:flex">
              <span>Chassis</span>
              <span>Drivetrain</span>
              <span>Range</span>
            </div>
            <span className="bg-[#C6EB63] px-2 py-0.5 text-[8.5px] font-semibold text-[#070A0F]">
              Configure
            </span>
          </div>

          <div className="relative mt-2.5 flex-1 overflow-hidden border border-white/12 bg-[#0F141C]">
            <SafeRibbonImage
              src={project.image}
              alt={project.imageAlt}
              fallbackBg="linear-gradient(135deg, #141b26, #070a0f)"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#070A0F]/90 via-[#070A0F]/35 to-transparent p-3">
              <div>
                <p className="text-[8.5px] uppercase tracking-[0.14em] text-[#C6EB63]">
                  Model S2 Carbon
                </p>
                <h3 className="text-[17px] font-medium tracking-tight text-white">
                  Silent city miles.
                </h3>
              </div>
              <span className="hidden font-space-mono text-[9px] text-[#E0E6F0]/80 tabular-nums sm:inline">
                140 KM · 14.8 KG
              </span>
            </div>
          </div>
        </div>
      );

    case 'verre':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#F3EDE4] p-3.5 text-[#1B1815] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#1B1815]/12 pb-2 text-[9.5px]">
            <span className="font-serif text-[16px] tracking-wide">MAISON VERRE</span>
            <span className="text-[#1B1815]/55">Paris · Season 08</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-center gap-3.5 pt-3">
            <div className="col-span-5 flex h-full flex-col justify-between">
              <div>
                <p className="text-[8.5px] tracking-[0.14em] uppercase text-[#8A4F3D]">
                  Editorial Capsule
                </p>
                <h3 className="mt-1 font-serif text-[20px] leading-[1.02]">
                  Linen, silk &amp; quiet shadow.
                </h3>
              </div>
              <span className="inline-block border-b border-[#1B1815]/45 pb-0.5 text-[9.5px] font-medium w-fit">
                Explore Collection
              </span>
            </div>
            <div className="col-span-7 h-full overflow-hidden border border-[#1B1815]/12 bg-[#DDD4C8]">
              <SafeRibbonImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #dcd2c4, #bfb2a0)"
              />
            </div>
          </div>
        </div>
      );

    case 'orbit':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#F5F7FA] p-3.5 text-[#0F172A] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-2 text-[9.5px]">
            <span className="font-semibold tracking-tight">Orbit Settlement</span>
            <div className="hidden items-center gap-3 text-[#64748B] sm:flex">
              <span className="font-medium text-[#0F172A]">Ledgers</span>
              <span>Payouts</span>
              <span>Audit</span>
            </div>
            <span className="border border-[#0F172A]/15 bg-white px-2 py-0.5 text-[8.5px] font-medium">
              Export CSV
            </span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-2.5 pt-2.5">
            <div className="col-span-7 flex flex-col justify-between border border-[#0F172A]/10 bg-white p-3">
              <div>
                <p className="text-[8.5px] uppercase tracking-[0.1em] text-[#64748B]">
                  Cross-Border Volume
                </p>
                <p className="mt-0.5 text-[20px] font-semibold tracking-tight tabular-nums">
                  €12,840,900
                </p>
              </div>
              <div className="space-y-1.5 border-t border-[#0F172A]/8 pt-2 text-[9px] tabular-nums">
                <div className="flex justify-between">
                  <span className="text-[#475569]">EUR → GBP Corridor</span>
                  <span className="font-medium text-[#0F172A]">£4,120,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475569]">USD → INR Treasury</span>
                  <span className="font-medium text-[#0F172A]">₹18,45,00,000</span>
                </div>
              </div>
            </div>

            <div className="col-span-5 flex flex-col justify-between border border-[#0F172A]/10 bg-[#0F172A] p-3 text-white">
              <p className="text-[8.5px] uppercase tracking-[0.12em] text-[#94A3B8]">
                Settlement SLA
              </p>
              <p className="text-[22px] font-semibold tabular-nums">0.4s</p>
              <p className="text-[9px] text-[#94A3B8]">
                Automated reconciliation across 28 institutional rails.
              </p>
            </div>
          </div>
        </div>
      );

    case 'kinetix':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#10090A] p-3.5 text-[#F0ECE7] sm:p-5">
          <div className="flex items-center justify-between border-b border-[#D99B52]/20 pb-2 text-[9.5px]">
            <span className="font-space-mono text-[10px] tracking-[0.14em] uppercase text-[#E4B272]">
              Kinetix Archive
            </span>
            <span className="text-[#A39E99]">Spatial Type Lab</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-end gap-3 pt-3">
            <div className="col-span-8 flex h-full flex-col justify-between border border-[#D99B52]/20 bg-[#170D0E] p-3">
              <span className="font-space-mono text-[8.5px] text-[#D99B52]">SPECIMEN 16</span>
              <h3 className="font-serif text-[26px] leading-[0.92] tracking-[-0.02em] sm:text-[32px]">
                Kinetic form in <span className="italic text-[#E4B272]">living space</span>.
              </h3>
              <span className="text-[9px] text-[#A39E99]">
                Interactive Variable Axis · Bezier Motion Study
              </span>
            </div>

            <div className="col-span-4 flex h-full flex-col justify-between border border-[#9F3035]/35 bg-[#1B0E10] p-2.5 text-[9px] tabular-nums">
              <span className="text-[#E4B272]">Index</span>
              <div className="space-y-1 text-[#F0ECE7]/75">
                <p>01 · Grid</p>
                <p>02 · Cadence</p>
                <p>03 · Optical</p>
              </div>
              <span className="border-t border-white/10 pt-1 text-[#A39E99]">2026 Edition</span>
            </div>
          </div>
        </div>
      );
  }
}
