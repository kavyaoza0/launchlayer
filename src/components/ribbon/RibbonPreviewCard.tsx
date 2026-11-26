import { useEffect, useRef, useState } from 'react';
import { WORLD_META, type RibbonProject } from './ribbonProjects';

interface RibbonPreviewCardProps {
  project: RibbonProject;
  isHovered: boolean;
  onAssetReady?: () => void;
}

function SafeCardPhoto({
  src,
  alt,
  fallbackBg,
  onSettled,
}: {
  src?: string;
  alt?: string;
  fallbackBg: string;
  onSettled?: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const reportedRef = useRef(false);

  const reportOnce = () => {
    if (!reportedRef.current) {
      reportedRef.current = true;
      onSettled?.();
    }
  };

  useEffect(() => {
    if (!src) reportOnce();
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className="flex h-full w-full items-center justify-center p-2"
        style={{ background: fallbackBg }}
      >
        <span className="text-center font-space-mono text-[8px] tracking-[0.12em] uppercase text-white/50">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={false}
      onLoad={reportOnce}
      onError={() => {
        setFailed(true);
        reportOnce();
      }}
      className="h-full w-full object-cover select-none"
    />
  );
}

function LaunchLayerSiteSurface({
  project,
  onReady,
}: {
  project: RibbonProject;
  onReady?: () => void;
}) {
  const readyFiredRef = useRef(false);
  const fireReady = () => {
    if (!readyFiredRef.current) {
      readyFiredRef.current = true;
      onReady?.();
    }
  };

  useEffect(() => {
    if (!project.image) fireReady();
  }, [project.image]);

  switch (project.theme) {
    case 'kanso':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#EFECE6] p-3 text-[#191816]">
          <div className="flex items-center justify-between border-b border-[#191816]/12 pb-1.5 text-[7.5px]">
            <span className="font-heading text-[12px] leading-none">Kanso</span>
            <div className="flex items-center gap-2 text-[#191816]/60">
              <span>Works</span>
              <span>Practice</span>
              <span>Journal</span>
            </div>
            <span className="text-[#191816]/55">Kyoto · Zurich</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-center gap-2.5 pt-2">
            <div className="col-span-5 flex h-full flex-col justify-between py-0.5">
              <div>
                <p className="text-[6.5px] tracking-[0.14em] uppercase text-[#191816]/55">
                  Spatial Monograph
                </p>
                <h3 className="mt-1 font-heading text-[15px] leading-[0.98] tracking-[-0.02em]">
                  Spaces shaped by <span className="italic">daylight</span>.
                </h3>
              </div>
              <span className="inline-block w-fit border-b border-[#191816]/50 pb-0.5 text-[7.5px] font-medium">
                View Monograph
              </span>
            </div>
            <div className="col-span-7 h-full overflow-hidden border border-[#191816]/12 bg-[#DDD7CC]">
              <SafeCardPhoto
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #d7d0c3, #b5ab99)"
                onSettled={fireReady}
              />
            </div>
          </div>
        </div>
      );

    case 'vespera':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#0E1913] p-3 text-[#F3EDE2]">
          <div className="flex items-center justify-between border-b border-[#F3EDE2]/12 pb-1.5 text-[7.5px]">
            <span className="font-heading text-[12px] tracking-wide">VESPERA</span>
            <div className="flex items-center gap-2 text-[#F3EDE2]/60">
              <span>Formulations</span>
              <span>Botanicals</span>
            </div>
            <span className="border border-[#C47F52]/45 px-1.5 py-0.5 text-[7px] text-[#E4A97E]">
              Bag (0)
            </span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-stretch gap-2 pt-2">
            <div className="col-span-6 overflow-hidden border border-[#F3EDE2]/10 bg-[#15241B]">
              <SafeCardPhoto
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #16261d, #0a120d)"
                onSettled={fireReady}
              />
            </div>
            <div className="col-span-6 flex flex-col justify-between border border-[#F3EDE2]/10 bg-[#142219] p-2">
              <div>
                <p className="text-[6.5px] tracking-[0.12em] uppercase text-[#C47F52]">
                  No. 02 · Evening Oil
                </p>
                <h3 className="mt-0.5 font-heading text-[14px] leading-[1.04]">
                  Cold-Pressed Neroli Elixir
                </h3>
              </div>
              <div className="space-y-1 border-t border-[#F3EDE2]/10 pt-1.5">
                <div className="flex items-baseline justify-between text-[7.5px] tabular-nums">
                  <span className="text-[#F3EDE2]/65">30 ml</span>
                  <span className="font-medium">$84</span>
                </div>
                <div className="bg-[#C47F52] py-0.5 text-center text-[7.5px] font-medium text-[#0E1913]">
                  Add to Bag
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'meridian':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#090C11] p-3 text-[#E8EEF7]">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[7.5px]">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 bg-[#34D399]" />
              <span className="font-semibold tracking-tight text-white">Meridian</span>
            </div>
            <div className="flex items-center gap-2 text-[#7E8B9E]">
              <span className="text-[#E8EEF7]">Treasury</span>
              <span>FX Desk</span>
            </div>
            <span className="font-space-mono text-[7px] text-[#7E8B9E] tabular-nums">UTC 14:20</span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-2 pt-2">
            <div className="col-span-7 flex flex-col justify-between border border-white/10 bg-[#111620] p-2">
              <div>
                <p className="text-[6.5px] tracking-[0.12em] uppercase text-[#7E8B9E]">
                  Consolidated Liquidity
                </p>
                <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-white tabular-nums">
                  $48,920,410<span className="text-[#7E8B9E]">.00</span>
                </p>
                <p className="text-[7px] text-[#34D399] tabular-nums">+2.41% net inflow</p>
              </div>
              <svg viewBox="0 0 220 44" className="h-7 w-full overflow-visible">
                <defs>
                  <linearGradient id="meridianLaunchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 36 L35 30 L70 33 L105 20 L145 23 L180 11 L220 5 L220 44 L0 44 Z"
                  fill="url(#meridianLaunchGrad)"
                />
                <path
                  d="M0 36 L35 30 L70 33 L105 20 L145 23 L180 11 L220 5"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <div className="col-span-5 flex flex-col justify-between border border-white/10 bg-[#0D1118] p-2 text-[7.5px] tabular-nums">
              <div className="border-b border-white/10 pb-1 text-[#7E8B9E]">Reserves</div>
              <div className="flex items-center justify-between">
                <span>USD Core</span>
                <span className="text-white">$24.18M</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SEPA EUR</span>
                <span className="text-white">€16.41M</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-1 text-[#34D399]">
                <span>Clearing</span>
                <span>Instant</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'soraia':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#E4E5E7] p-3 text-[#151618]">
          <div className="flex items-center justify-between border-b border-[#151618]/14 pb-1.5 text-[7.5px] font-medium">
            <div className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D93829]" />
              <span className="tracking-tight">SORAIA ACOUSTICS</span>
            </div>
            <span className="font-space-mono text-[7px] text-[#151618]/65 tabular-nums">
              SERIES R-01
            </span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-stretch gap-2.5 pt-2">
            <div className="col-span-5 flex flex-col justify-between">
              <div>
                <h3 className="text-[14px] font-semibold leading-[0.98] tracking-[-0.03em]">
                  Reference Monitor 01
                </h3>
                <p className="mt-1 text-[7.5px] leading-snug text-[#151618]/65">
                  CNC-machined anodized enclosure.
                </p>
              </div>
              <div className="space-y-1 border-t border-[#151618]/14 pt-1.5 text-[7px] tabular-nums">
                <div className="flex justify-between text-[#151618]/75">
                  <span>Response</span>
                  <span>38Hz–28kHz</span>
                </div>
                <div className="bg-[#D93829] py-0.5 text-center text-[7.5px] font-medium text-white">
                  Reserve Edition
                </div>
              </div>
            </div>
            <div className="col-span-7 overflow-hidden border border-[#151618]/14 bg-[#1C1D20]">
              <SafeCardPhoto
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #27292e, #151618)"
                onSettled={fireReady}
              />
            </div>
          </div>
        </div>
      );

    case 'solis':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#F4EFE8] p-3 text-[#221E1A]">
          <div className="flex items-center justify-between border-b border-[#221E1A]/12 pb-1.5 text-[7.5px]">
            <span className="font-heading text-[12px] tracking-tight">Solis Interiors</span>
            <span className="text-[#785E45]">Milan · Mallorca</span>
          </div>

          <div className="relative mt-2 flex-1 overflow-hidden border border-[#221E1A]/12 bg-[#DDD4C7]">
            <SafeCardPhoto
              src={project.image}
              alt={project.imageAlt}
              fallbackBg="linear-gradient(135deg, #e0d6c8, #bcae9c)"
              onSettled={fireReady}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1612]/82 via-[#1A1612]/30 to-transparent p-2.5 text-[#F7F3ED]">
              <p className="text-[6.5px] tracking-[0.14em] uppercase text-[#E4D1B9]">
                Limestone &amp; Travertine
              </p>
              <h3 className="mt-0.5 font-heading text-[15px] leading-tight">
                Quiet Mediterranean Living
              </h3>
            </div>
          </div>
        </div>
      );

    case 'vance':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#111215] p-3 text-[#ECEAE5]">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[7.5px]">
            <span className="font-medium tracking-[0.06em] uppercase">Vance &amp; Hale</span>
            <span className="border border-white/20 px-1.5 py-0.5 text-[7px]">London</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-center gap-2.5 pt-2">
            <div className="col-span-6 flex h-full flex-col justify-between">
              <div>
                <p className="text-[6.5px] tracking-[0.14em] uppercase text-[#C9A87C]">
                  Industrial Practice
                </p>
                <h3 className="mt-1 font-heading text-[15px] leading-[1.04]">
                  Long-horizon stewardship for founders.
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-1.5 border-t border-white/10 pt-1.5 text-[7px] tabular-nums text-[#9C9EA4]">
                <div>
                  <span className="block text-[10px] font-medium text-[#ECEAE5]">18</span>
                  <span>Offices</span>
                </div>
                <div>
                  <span className="block text-[10px] font-medium text-[#ECEAE5]">2014</span>
                  <span>Founded</span>
                </div>
              </div>
            </div>
            <div className="col-span-6 h-full overflow-hidden border border-white/10 bg-[#1B1C20]">
              <SafeCardPhoto
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #25272d, #111215)"
                onSettled={fireReady}
              />
            </div>
          </div>
        </div>
      );

    case 'sorel':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#18191B] p-3 text-[#F4F2EE]">
          <div className="flex items-center justify-between border-b border-white/12 pb-1.5 text-[7.5px]">
            <span className="font-heading text-[12px] italic tracking-tight">Atelier Sorel</span>
            <span className="text-[#A5A7AC]">Autumn / Winter</span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-2 pt-2">
            <div className="col-span-8 overflow-hidden border border-white/10 bg-[#232528]">
              <SafeCardPhoto
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #2e3034, #17181a)"
                onSettled={fireReady}
              />
            </div>
            <div className="col-span-4 flex flex-col justify-between border border-white/10 bg-[#1F2124] p-2">
              <div>
                <p className="text-[6.5px] tracking-[0.14em] uppercase text-[#D6B185]">Look 04</p>
                <h3 className="mt-0.5 font-heading text-[13px] leading-tight">Merino Overcoat</h3>
              </div>
              <div className="bg-[#F4F2EE] py-0.5 text-center text-[7px] font-medium text-[#18191B]">
                Lookbook
              </div>
            </div>
          </div>
        </div>
      );

    case 'kronos':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#0B0B0D] p-3 text-[#EDE8E0]">
          <div className="flex items-center justify-between border-b border-[#D99B52]/20 pb-1.5 text-[7.5px]">
            <span className="font-space-mono text-[8.5px] tracking-[0.16em] uppercase text-[#E4B272]">
              KRONOS
            </span>
            <span className="text-[#E4B272]">Geneva</span>
          </div>

          <div className="relative mt-2 flex-1 overflow-hidden border border-[#D99B52]/20 bg-[#141417]">
            <SafeCardPhoto
              src={project.image}
              alt={project.imageAlt}
              fallbackBg="linear-gradient(135deg, #1b1a17, #0b0b0d)"
              onSettled={fireReady}
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-r from-[#0B0B0D]/85 via-[#0B0B0D]/30 to-transparent p-2.5">
              <p className="text-[6.5px] tracking-[0.14em] uppercase text-[#D99B52]">Calibre 09</p>
              <h3 className="mt-0.5 font-heading text-[15px] leading-none text-[#F4EFE6]">
                Slate Dial Chronograph
              </h3>
            </div>
          </div>
        </div>
      );

    case 'forma':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#F7F4EE] p-3 text-[#171513]">
          <div className="flex items-center justify-between border-b border-[#171513]/12 pb-1.5 text-[7.5px]">
            <span className="font-medium tracking-tight">FORMA STUDIO 04</span>
            <span className="text-[#171513]/55">Ceramic Atelier</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-stretch gap-2 pt-2">
            <div className="col-span-6 overflow-hidden border border-[#171513]/12 bg-[#E5DFD5]">
              <SafeCardPhoto
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #e5dfd5, #c8bfb0)"
                onSettled={fireReady}
              />
            </div>
            <div className="col-span-6 flex flex-col justify-between py-0.5">
              <div>
                <p className="text-[6.5px] tracking-[0.14em] uppercase text-[#9A4E36]">
                  Studio Portfolio
                </p>
                <h3 className="mt-0.5 font-heading text-[15px] leading-[1] tracking-[-0.02em]">
                  Raw clay, ash glaze &amp; kiln forms.
                </h3>
              </div>
              <div className="flex justify-between border-t border-[#171513]/12 pt-1 text-[7.5px] text-[#171513]/75">
                <span>Vessel II</span>
                <span className="tabular-nums">2026</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'stratum':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#080D17] p-3 text-[#E5ECF6]">
          <div className="flex items-center justify-between border-b border-[#3B82F6]/20 pb-1.5 text-[7.5px]">
            <span className="font-semibold tracking-tight text-white">Stratum Cloud</span>
            <span className="bg-[#2563EB] px-1.5 py-0.5 text-[7px] font-medium text-white">
              Deploy
            </span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-2 pt-2">
            <div className="col-span-4 flex flex-col justify-between border border-white/10 bg-[#0E1525] p-2 text-[7px]">
              <span className="text-[#8294B0]">Regions</span>
              <div className="space-y-1 tabular-nums">
                <div className="flex justify-between">
                  <span>fra-01</span>
                  <span className="text-[#60A5FA]">11ms</span>
                </div>
                <div className="flex justify-between">
                  <span>sin-02</span>
                  <span className="text-[#60A5FA]">18ms</span>
                </div>
              </div>
            </div>

            <div className="col-span-8 flex flex-col justify-between border border-white/10 bg-[#0E1525] p-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[6.5px] uppercase tracking-[0.12em] text-[#8294B0]">
                    Throughput
                  </p>
                  <p className="text-[14px] font-semibold text-white tabular-nums">142.8k/s</p>
                </div>
                <span className="text-[7px] text-[#60A5FA] tabular-nums">99.98%</span>
              </div>
              <div className="grid h-9 grid-cols-12 items-end gap-0.5 pt-1">
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
        <div className="flex h-full w-full flex-col justify-between bg-[#EAE3D5] p-3 text-[#141311]">
          <div className="flex items-center justify-between border-b border-[#141311]/18 pb-1.5 text-[7px] tracking-[0.1em] uppercase">
            <span className="font-semibold">Monograph Press</span>
            <span>Issue 11</span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-2 pt-2">
            <div className="col-span-7 overflow-hidden border border-[#141311]/20 bg-[#1A1917]">
              <SafeCardPhoto
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #272522, #11100e)"
                onSettled={fireReady}
              />
            </div>
            <div className="col-span-5 flex flex-col justify-between border-l border-[#141311]/15 pl-2">
              <div>
                <p className="font-space-mono text-[6.5px] text-[#8F342A]">ESSAY 04</p>
                <h3 className="mt-0.5 font-heading text-[14px] leading-[0.98]">
                  Printed Rhythm
                </h3>
              </div>
              <span className="font-space-mono text-[7px] uppercase tracking-[0.1em] underline">
                Read Issue
              </span>
            </div>
          </div>
        </div>
      );

    case 'tala':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#1A1310] p-3 text-[#F2E9DC]">
          <div className="flex items-center justify-between border-b border-[#F2E9DC]/14 pb-1.5 text-[7.5px]">
            <span className="font-heading text-[12px] tracking-wide">Tala &amp; Co.</span>
            <span className="text-[#C06342]">Reserve</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-stretch gap-2 pt-2">
            <div className="col-span-7 overflow-hidden border border-[#F2E9DC]/12 bg-[#261C18]">
              <SafeCardPhoto
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #2a1e18, #140e0c)"
                onSettled={fireReady}
              />
            </div>
            <div className="col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-[6.5px] uppercase tracking-[0.12em] text-[#C06342]">
                  Autumn Tasting
                </p>
                <h3 className="mt-0.5 font-heading text-[14px] leading-[1.04]">
                  Fire, grain &amp; <span className="italic">harvest</span>.
                </h3>
              </div>
              <div className="border border-[#F2E9DC]/25 py-0.5 text-center text-[7px]">
                Book Table
              </div>
            </div>
          </div>
        </div>
      );

    case 'norden':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#070A0F] p-3 text-[#E0E6F0]">
          <div className="flex items-center justify-between border-b border-white/12 pb-1.5 text-[7.5px]">
            <span className="font-semibold tracking-[0.14em] uppercase">NORDEN</span>
            <span className="bg-[#C6EB63] px-1.5 py-0.5 text-[7px] font-semibold text-[#070A0F]">
              Configure
            </span>
          </div>

          <div className="relative mt-2 flex-1 overflow-hidden border border-white/12 bg-[#0F141C]">
            <SafeCardPhoto
              src={project.image}
              alt={project.imageAlt}
              fallbackBg="linear-gradient(135deg, #141b26, #070a0f)"
              onSettled={fireReady}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#070A0F]/90 via-[#070A0F]/35 to-transparent p-2.5">
              <div>
                <p className="text-[6.5px] uppercase tracking-[0.14em] text-[#C6EB63]">
                  Model S2 Carbon
                </p>
                <h3 className="text-[14px] font-medium tracking-tight text-white">
                  Silent city miles.
                </h3>
              </div>
              <span className="font-space-mono text-[7px] text-[#E0E6F0]/80 tabular-nums">
                140 KM
              </span>
            </div>
          </div>
        </div>
      );

    case 'verre':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#F3EDE4] p-3 text-[#1B1815]">
          <div className="flex items-center justify-between border-b border-[#1B1815]/12 pb-1.5 text-[7.5px]">
            <span className="font-heading text-[12px] tracking-wide">MAISON VERRE</span>
            <span className="text-[#1B1815]/55">Paris · 08</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-center gap-2 pt-2">
            <div className="col-span-5 flex h-full flex-col justify-between">
              <div>
                <p className="text-[6.5px] tracking-[0.14em] uppercase text-[#8A4F3D]">
                  Editorial Capsule
                </p>
                <h3 className="mt-0.5 font-heading text-[15px] leading-[1.02]">
                  Linen &amp; quiet shadow.
                </h3>
              </div>
              <span className="inline-block w-fit border-b border-[#1B1815]/45 pb-0.5 text-[7px] font-medium">
                Collection
              </span>
            </div>
            <div className="col-span-7 h-full overflow-hidden border border-[#1B1815]/12 bg-[#DDD4C8]">
              <SafeCardPhoto
                src={project.image}
                alt={project.imageAlt}
                fallbackBg="linear-gradient(135deg, #dcd2c4, #bfb2a0)"
                onSettled={fireReady}
              />
            </div>
          </div>
        </div>
      );

    case 'orbit':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#F5F7FA] p-3 text-[#0F172A]">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-1.5 text-[7.5px]">
            <span className="font-semibold tracking-tight">Orbit Settlement</span>
            <span className="border border-[#0F172A]/15 bg-white px-1.5 py-0.5 text-[7px] font-medium">
              Export CSV
            </span>
          </div>

          <div className="grid flex-1 grid-cols-12 gap-2 pt-2">
            <div className="col-span-7 flex flex-col justify-between border border-[#0F172A]/10 bg-white p-2">
              <div>
                <p className="text-[6.5px] uppercase tracking-[0.1em] text-[#64748B]">
                  Cross-Border Volume
                </p>
                <p className="mt-0.5 text-[15px] font-semibold tracking-tight tabular-nums">
                  €12,840,900
                </p>
              </div>
              <div className="space-y-1 border-t border-[#0F172A]/8 pt-1 text-[7px] tabular-nums">
                <div className="flex justify-between">
                  <span className="text-[#475569]">EUR → GBP</span>
                  <span className="font-medium text-[#0F172A]">£4.12M</span>
                </div>
              </div>
            </div>

            <div className="col-span-5 flex flex-col justify-between border border-[#0F172A]/10 bg-[#0F172A] p-2 text-white">
              <p className="text-[6.5px] uppercase tracking-[0.12em] text-[#94A3B8]">SLA</p>
              <p className="text-[17px] font-semibold tabular-nums">0.4s</p>
              <p className="text-[7px] text-[#94A3B8]">28 rails</p>
            </div>
          </div>
        </div>
      );

    case 'kinetix':
      return (
        <div className="flex h-full w-full flex-col justify-between bg-[#10090A] p-3 text-[#F0ECE7]">
          <div className="flex items-center justify-between border-b border-[#D99B52]/20 pb-1.5 text-[7.5px]">
            <span className="font-space-mono text-[8px] tracking-[0.14em] uppercase text-[#E4B272]">
              Kinetix Archive
            </span>
            <span className="text-[#A39E99]">Type Lab</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-end gap-2 pt-2">
            <div className="col-span-8 flex h-full flex-col justify-between border border-[#D99B52]/20 bg-[#170D0E] p-2">
              <span className="font-space-mono text-[6.5px] text-[#D99B52]">SPECIMEN 16</span>
              <h3 className="font-heading text-[20px] leading-[0.92] tracking-[-0.02em]">
                Kinetic form in <span className="italic text-[#E4B272]">space</span>.
              </h3>
              <span className="text-[7px] text-[#A39E99]">Bezier Motion Study</span>
            </div>

            <div className="col-span-4 flex h-full flex-col justify-between border border-[#9F3035]/35 bg-[#1B0E10] p-2 text-[7px] tabular-nums">
              <span className="text-[#E4B272]">Index</span>
              <div className="space-y-0.5 text-[#F0ECE7]/75">
                <p>01 · Grid</p>
                <p>02 · Cadence</p>
              </div>
              <span className="border-t border-white/10 pt-1 text-[#A39E99]">2026</span>
            </div>
          </div>
        </div>
      );
  }
}

export function RibbonPreviewCard({
  project,
  isHovered,
  onAssetReady,
}: RibbonPreviewCardProps) {
  const world = WORLD_META[project.world];

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[16px] bg-[#0E2A3B]"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* LaunchLayer Website Preview */}
      <div aria-hidden="true" className="h-full w-full">
        <LaunchLayerSiteSurface project={project} onReady={onAssetReady} />
      </div>

      {/* Subtle glass specular top-edge sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_45%)]"
      />

      {/* Bottom-left Chip: 14px in, pill, rgba(0,0,0,.55), "No. 01".."No. 16" (fades out on hover) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-[14px] left-[14px] inline-flex items-center rounded-full bg-black/55 px-[10px] py-[5px] font-space-mono text-[12px] leading-none text-white backdrop-blur-[6px] transition-opacity duration-250 ease-out ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="tabular-nums">No. {project.number}</span>
      </div>

      {/* Hover Label Bar: 12px inset, radius 12px, world colour bg, --on text, clip-path left reveal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12px] bottom-[12px] flex items-center justify-between gap-2.5 rounded-[12px] px-[14px] py-[10px]"
        style={{
          backgroundColor: world.color,
          color: world.onColor,
          clipPath: isHovered ? 'inset(0% 0% 0% 0% round 12px)' : 'inset(0% 100% 0% 0% round 12px)',
          transition: 'clip-path 500ms cubic-bezier(0.22, 1, 0.36, 1) 50ms',
        }}
      >
        <div className="min-w-0">
          <div className="font-space-mono text-[10.5px] font-medium leading-none tracking-[0.12em] uppercase">
            {world.label} · {project.category}
          </div>
          <div className="mt-1 truncate font-heading text-[21px] leading-[1.05]">
            {project.title}
          </div>
        </div>

        <span
          className="shrink-0 font-sans text-[17px] leading-none"
          style={{
            transform: isHovered ? 'translate3d(0, 0, 0)' : 'translate3d(-6px, 6px, 0)',
            opacity: isHovered ? 1 : 0,
            transition:
              'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 150ms, opacity 350ms ease 150ms',
          }}
        >
          &#8599;
        </span>
      </div>
    </div>
  );
}
