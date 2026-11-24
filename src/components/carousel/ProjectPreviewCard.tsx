import { useState } from 'react';
import type { ShowcaseProject } from './projectData';

interface ProjectPreviewCardProps {
  project: ShowcaseProject;
}

function SafePreviewImage({
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
        className={`flex h-full w-full items-center justify-center ${className}`}
        style={{ background: fallbackBg }}
      >
        <span className="text-[11px] tracking-widest uppercase text-white/40">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover select-none ${className}`}
    />
  );
}

export function ProjectPreviewCard({ project }: ProjectPreviewCardProps) {
  switch (project.theme) {
    case 'kanso':
      return (
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#EFECE6] p-4 text-[#191816] sm:p-6">
          {/* Miniature Website Chrome */}
          <div className="flex items-center justify-between border-b border-[#191816]/12 pb-2.5 text-[10px] tracking-[0.02em] sm:text-[11px]">
            <span className="font-serif text-base leading-none tracking-tight sm:text-lg">
              Kanso
            </span>
            <div className="hidden items-center gap-4 text-[#191816]/65 sm:flex">
              <span>Works</span>
              <span>Practice</span>
              <span>Journal</span>
            </div>
            <span className="text-[#191816]/60">Kyoto · Zurich</span>
          </div>

          {/* Editorial Split */}
          <div className="my-auto grid flex-1 grid-cols-12 items-center gap-3 py-3 sm:gap-5 sm:py-4">
            <div className="col-span-5 flex h-full flex-col justify-between py-1">
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-[0.14em] text-[#191816]/55 sm:text-[10px]">
                  Selected Monograph
                </p>
                <h3 className="font-serif text-[22px] leading-[0.98] tracking-[-0.02em] sm:text-[32px]">
                  Spaces shaped by <span className="italic">daylight</span> and silence.
                </h3>
              </div>
              <div className="space-y-2.5">
                <p className="hidden text-[11px] leading-relaxed text-[#191816]/70 sm:block">
                  Timber, poured concrete, and calm water courts composed for quiet permanence.
                </p>
                <div className="inline-flex items-center gap-2 border-b border-[#191816]/60 pb-0.5 text-[10px] font-medium sm:text-[11px]">
                  <span>View Monograph</span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </div>

            <div className="col-span-7 h-full overflow-hidden border border-[#191816]/12 bg-[#DDD7CC]">
              <SafePreviewImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #d7d0c3, #b5ab99)"
              />
            </div>
          </div>

          {/* Integrated Project Title & Category */}
          <div className="flex items-center justify-between border-t border-[#191816]/12 pt-2 text-[10px] text-[#191816]/60 sm:text-[11px]">
            <span className="font-medium text-[#191816]">{project.title}</span>
            <span>{project.category}</span>
          </div>
        </div>
      );

    case 'vespera':
      return (
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0E1913] p-4 text-[#F3EDE2] sm:p-6">
          <div className="flex items-center justify-between border-b border-[#F3EDE2]/12 pb-2.5 text-[10px] sm:text-[11px]">
            <span className="font-serif text-base tracking-wide text-[#F3EDE2] sm:text-lg">
              VESPERA
            </span>
            <div className="hidden items-center gap-4 text-[#F3EDE2]/65 sm:flex">
              <span>Formulations</span>
              <span>Botanicals</span>
              <span>Ritual</span>
            </div>
            <span className="border border-[#C47F52]/50 px-2 py-0.5 text-[9.5px] text-[#E4A97E]">
              Bag (0)
            </span>
          </div>

          <div className="my-auto grid flex-1 grid-cols-12 items-stretch gap-3 py-3 sm:gap-5 sm:py-4">
            <div className="col-span-6 overflow-hidden border border-[#F3EDE2]/12 bg-[#15241B]">
              <SafePreviewImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #16261d, #0a120d)"
              />
            </div>

            <div className="col-span-6 flex flex-col justify-between bg-[#15241B]/75 p-3 border border-[#F3EDE2]/10 sm:p-4">
              <div>
                <p className="text-[9.5px] tracking-[0.12em] uppercase text-[#C47F52]">
                  No. 02 · Evening Oil
                </p>
                <h3 className="mt-1.5 font-serif text-[20px] leading-[1.04] sm:text-[26px]">
                  Cold-Pressed Neroli Elixir
                </h3>
                <p className="mt-2 hidden text-[10.5px] leading-relaxed text-[#F3EDE2]/70 sm:block">
                  Wild-harvested bitter orange blossom, olive squalane, and sea buckthorn seed.
                </p>
              </div>

              <div className="space-y-2.5 border-t border-[#F3EDE2]/10 pt-2.5">
                <div className="flex items-baseline justify-between text-[11px] tabular-nums">
                  <span className="text-[#F3EDE2]/60">30 ml / 1.0 fl oz</span>
                  <span className="font-medium text-[#F3EDE2]">$84</span>
                </div>
                <div className="bg-[#C47F52] px-3 py-1.5 text-center text-[10px] font-medium tracking-wide text-[#0E1913] sm:text-[11px]">
                  Add to Bag
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#F3EDE2]/12 pt-2 text-[10px] text-[#F3EDE2]/60 sm:text-[11px]">
            <span className="font-medium text-[#F3EDE2]">{project.title}</span>
            <span>{project.category}</span>
          </div>
        </div>
      );

    case 'meridian':
      return (
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#090C11] p-4 text-[#E8EEF7] sm:p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 bg-[#34D399]" />
              <span className="font-semibold tracking-tight text-white">Meridian</span>
            </div>
            <div className="hidden items-center gap-4 text-[#7E8B9E] sm:flex">
              <span className="text-[#E8EEF7]">Treasury</span>
              <span>FX Desk</span>
              <span>Settlements</span>
            </div>
            <span className="text-[#7E8B9E] tabular-nums">UTC 14:20</span>
          </div>

          <div className="my-auto flex flex-1 flex-col justify-between gap-3 py-3 sm:py-4">
            <div className="grid grid-cols-12 items-end gap-3 border border-white/10 bg-[#111620] p-3 sm:p-4">
              <div className="col-span-7">
                <p className="text-[9.5px] uppercase tracking-[0.12em] text-[#7E8B9E]">
                  Consolidated Liquidity
                </p>
                <p className="mt-1 text-[22px] font-semibold tracking-tight text-white tabular-nums sm:text-[28px]">
                  $48,920,410<span className="text-[#7E8B9E]">.00</span>
                </p>
                <p className="mt-1 text-[10px] text-[#34D399] tabular-nums">
                  +2.41% net inflow · 3 active corridors
                </p>
              </div>
              <div className="col-span-5 h-14 sm:h-16">
                <svg viewBox="0 0 180 64" className="h-full w-full overflow-visible">
                  <defs>
                    <linearGradient id="meridianFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 52 L28 45 L56 48 L84 32 L112 35 L140 18 L180 10 L180 64 L0 64 Z"
                    fill="url(#meridianFill)"
                  />
                  <path
                    d="M0 52 L28 45 L56 48 L84 32 L112 35 L140 18 L180 10"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="1.75"
                  />
                </svg>
              </div>
            </div>

            <div className="divide-y divide-white/8 border border-white/10 bg-[#0D1118] text-[10.5px] tabular-nums sm:text-[11px]">
              <div className="grid grid-cols-12 px-3 py-2 text-[#7E8B9E]">
                <span className="col-span-5">Account</span>
                <span className="col-span-3">Currency</span>
                <span className="col-span-4 text-right">Available</span>
              </div>
              <div className="grid grid-cols-12 px-3 py-2">
                <span className="col-span-5 text-[#E8EEF7]">Operating Reserve</span>
                <span className="col-span-3 text-[#7E8B9E]">USD</span>
                <span className="col-span-4 text-right text-[#E8EEF7]">$24,180,000</span>
              </div>
              <div className="grid grid-cols-12 px-3 py-2">
                <span className="col-span-5 text-[#E8EEF7]">SEPA Clearing</span>
                <span className="col-span-3 text-[#7E8B9E]">EUR</span>
                <span className="col-span-4 text-right text-[#E8EEF7]">€16,410,500</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-[#7E8B9E] sm:text-[11px]">
            <span className="font-medium text-[#E8EEF7]">{project.title}</span>
            <span>{project.category}</span>
          </div>
        </div>
      );

    case 'soraia':
      return (
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#E4E5E7] p-4 text-[#151618] sm:p-6">
          <div className="flex items-center justify-between border-b border-[#151618]/15 pb-2.5 text-[10px] font-medium sm:text-[11px]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#D93829]" />
              <span className="tracking-tight">SORAIA ACOUSTICS</span>
            </div>
            <span className="text-[#151618]/60 tabular-nums">SERIES R-01</span>
          </div>

          <div className="my-auto flex flex-1 flex-col justify-between gap-2.5 py-2.5 sm:py-3">
            <div className="flex items-end justify-between gap-4">
              <h3 className="text-[22px] font-semibold leading-[0.95] tracking-[-0.03em] sm:text-[30px]">
                Reference Monitor 01
              </h3>
              <span className="hidden bg-[#D93829] px-2.5 py-1 text-[10px] font-medium text-white sm:inline-block">
                Pre-Order
              </span>
            </div>

            <div className="relative flex-1 overflow-hidden border border-[#151618]/15 bg-[#1C1D20]">
              <SafePreviewImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #27292e, #151618)"
              />
            </div>

            <div className="grid grid-cols-3 border-t border-[#151618]/15 pt-2 text-[9.5px] tabular-nums text-[#151618]/75 sm:text-[10.5px]">
              <span>38 Hz – 28 kHz</span>
              <span className="text-center">CNC Anodized 6061</span>
              <span className="text-right">Class-A 180W</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#151618]/15 pt-2 text-[10px] text-[#151618]/60 sm:text-[11px]">
            <span className="font-semibold text-[#151618]">{project.title}</span>
            <span>{project.category}</span>
          </div>
        </div>
      );

    case 'tala':
      return (
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#1A1310] p-4 text-[#F2E9DC] sm:p-6">
          <div className="flex items-center justify-between border-b border-[#F2E9DC]/14 pb-2.5 text-[10px] sm:text-[11px]">
            <span className="text-[#F2E9DC]/65">Menu</span>
            <span className="font-serif text-lg tracking-wide sm:text-xl">Tala &amp; Co.</span>
            <span className="text-[#C06342]">Reserve</span>
          </div>

          <div className="my-auto grid flex-1 grid-cols-12 items-stretch gap-3 py-3 sm:gap-5 sm:py-4">
            <div className="col-span-7 overflow-hidden border border-[#F2E9DC]/12 bg-[#261C18]">
              <SafePreviewImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #2a1e18, #140e0c)"
              />
            </div>

            <div className="col-span-5 flex flex-col justify-between py-1">
              <div className="space-y-2">
                <p className="text-[9.5px] uppercase tracking-[0.12em] text-[#C06342]">
                  Autumn Tasting
                </p>
                <h3 className="font-serif text-[20px] leading-[1.02] sm:text-[26px]">
                  Fire, grain &amp; <span className="italic">late harvest</span>.
                </h3>
              </div>

              <div className="space-y-1.5 border-y border-[#F2E9DC]/12 py-2.5 text-[10px] text-[#F2E9DC]/75 sm:text-[10.5px]">
                <p>01 · Hearth sourdough, cultured butter</p>
                <p>02 · Charred leek, hazelnut emulsion</p>
                <p className="hidden sm:block">03 · Smoked plum, toasted buckwheat</p>
              </div>

              <div className="border border-[#F2E9DC]/25 px-3 py-1.5 text-center text-[10px] tracking-wide text-[#F2E9DC] sm:text-[11px]">
                Book a Table · Thu–Sun
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#F2E9DC]/14 pt-2 text-[10px] text-[#F2E9DC]/60 sm:text-[11px]">
            <span className="font-medium text-[#F2E9DC]">{project.title}</span>
            <span>{project.category}</span>
          </div>
        </div>
      );

    case 'norden':
      return (
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#070A0F] p-4 text-[#E0E6F0] sm:p-6">
          <div className="flex items-center justify-between border-b border-white/12 pb-2.5 text-[10px] sm:text-[11px]">
            <span className="font-semibold tracking-[0.14em] uppercase">NORDEN</span>
            <div className="hidden items-center gap-4 text-[#E0E6F0]/60 sm:flex">
              <span>Chassis</span>
              <span>Drivetrain</span>
              <span>Test Ride</span>
            </div>
            <span className="bg-[#C6EB63] px-2.5 py-0.5 text-[9.5px] font-semibold text-[#070A0F]">
              Configure
            </span>
          </div>

          <div className="my-auto flex flex-1 flex-col justify-between gap-2.5 py-2.5 sm:py-3">
            <div className="relative flex-1 overflow-hidden border border-white/12 bg-[#0F141C]">
              <SafePreviewImage
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #141b26, #070a0f)"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#070A0F]/90 via-[#070A0F]/35 to-transparent p-3 sm:p-4">
                <p className="text-[9.5px] uppercase tracking-[0.14em] text-[#C6EB63]">
                  Model S2 Carbon
                </p>
                <h3 className="mt-0.5 text-[18px] font-medium tracking-tight text-white sm:text-[24px]">
                  Engineered for silent city miles.
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border border-white/10 bg-[#0D121A] px-3 py-2 text-[10px] tabular-nums sm:text-[11px]">
              <div>
                <span className="block text-[9px] text-[#E0E6F0]/50">Range</span>
                <span className="font-medium text-white">140 km</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#E0E6F0]/50">Weight</span>
                <span className="font-medium text-white">14.8 kg</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] text-[#E0E6F0]/50">Drive</span>
                <span className="font-medium text-[#C6EB63]">Carbon Belt</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/12 pt-2 text-[10px] text-[#E0E6F0]/60 sm:text-[11px]">
            <span className="font-medium text-[#E0E6F0]">{project.title}</span>
            <span>{project.category}</span>
          </div>
        </div>
      );
  }
}
