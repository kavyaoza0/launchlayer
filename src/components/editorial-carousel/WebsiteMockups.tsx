import { useState } from 'react';

export type MockupDirection =
  | 'architecture'
  | 'ecommerce'
  | 'fintech'
  | 'hardware'
  | 'lifestyle';

interface WebsiteMockupProps {
  direction: MockupDirection;
  compact?: boolean;
  className?: string;
}

function SafeMockupImg({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="h-full w-full" style={{ background: fallback }} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover select-none"
    />
  );
}

/**
 * Anonymous, self-contained website direction mockups with distinct visual identities,
 * zero captions, zero invented client claims, and zero repeated templates.
 * Note: 'architecture' is intentionally shared between Slide 04 (Launch) and Slide 05 (Plan Your Direction).
 */
export function WebsiteMockup({ direction, compact = false, className = '' }: WebsiteMockupProps) {
  switch (direction) {
    case 'architecture':
      return (
        <div
          className={`flex h-full w-full flex-col justify-between overflow-hidden bg-[#EFECE6] text-[#191816] ${
            compact ? 'p-2.5' : 'p-4 sm:p-5'
          } ${className}`}
        >
          {/* Minimal architectural masthead without business names */}
          <div className="flex items-center justify-between border-b border-[#191816]/12 pb-1.5 text-[8px] tracking-[0.1em] uppercase text-[#191816]/65 sm:text-[9px]">
            <span>01 / Spatial Study</span>
            <div className="flex items-center gap-2.5">
              <span>Works</span>
              <span>Index</span>
            </div>
          </div>

          <div className="my-auto grid flex-1 grid-cols-12 items-stretch gap-2.5 py-2 sm:gap-3.5 sm:py-3">
            <div className="col-span-5 flex flex-col justify-between py-0.5">
              <p
                className={`font-serif leading-[0.96] tracking-[-0.02em] ${
                  compact ? 'text-[14px]' : 'text-[19px] sm:text-[26px]'
                }`}
              >
                Spaces shaped by <span className="italic">daylight</span> and stillness.
              </p>
              <div className="space-y-1.5">
                {!compact && (
                  <p className="hidden text-[9.5px] leading-relaxed text-[#191816]/65 sm:block">
                    Board-formed concrete, warm cedar soffits, and quiet reflecting courts.
                  </p>
                )}
                <div className="inline-block border-b border-[#191816]/60 pb-0.5 text-[8px] font-medium tracking-wide uppercase sm:text-[9px]">
                  Explore Pavilion →
                </div>
              </div>
            </div>

            <div className="col-span-7 overflow-hidden border border-[#191816]/12 bg-[#DDD7CC]">
              <SafeMockupImg
                src="/src/assets/images/project_kanso_architecture_1795538724169.jpg"
                alt="Architectural concrete and timber pavilion beside reflecting pool"
                fallback="linear-gradient(135deg, #d7d0c3, #b5ab99)"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#191816]/12 pt-1.5 text-[7.5px] tracking-[0.08em] uppercase text-[#191816]/50 sm:text-[8.5px]">
            <span>35.0116° N</span>
            <span>Monograph Series</span>
          </div>
        </div>
      );

    case 'ecommerce':
      return (
        <div
          className={`flex h-full w-full flex-col justify-between overflow-hidden bg-[#0E1913] text-[#F3EDE2] ${
            compact ? 'p-2.5' : 'p-3.5 sm:p-4'
          } ${className}`}
        >
          <div className="flex items-center justify-between border-b border-[#F3EDE2]/12 pb-1.5 text-[8px] tracking-[0.12em] uppercase text-[#F3EDE2]/65">
            <span>Botanicals</span>
            <span className="border border-[#C47F52]/50 px-1.5 py-0.5 text-[7px] text-[#E4A97E]">
              Bag (0)
            </span>
          </div>

          <div className="my-auto grid flex-1 grid-cols-12 items-stretch gap-2 py-2">
            <div className="col-span-6 overflow-hidden border border-[#F3EDE2]/12 bg-[#15241B]">
              <SafeMockupImg
                src="/src/assets/images/project_vespera_botanical_1795538724689.jpg"
                alt="Dark amber dropper bottle on basalt stone"
                fallback="linear-gradient(135deg, #16261d, #0a120d)"
              />
            </div>
            <div className="col-span-6 flex flex-col justify-between border border-[#F3EDE2]/10 bg-[#15241B]/80 p-2">
              <div>
                <span className="block text-[7px] uppercase tracking-[0.14em] text-[#C47F52]">
                  Evening Oil
                </span>
                <p
                  className={`mt-1 font-serif leading-[1.04] ${
                    compact ? 'text-[12px]' : 'text-[15px] sm:text-[18px]'
                  }`}
                >
                  Neroli &amp; Squalane Elixir
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] tabular-nums text-[#F3EDE2]/75">
                  <span>30 ml</span>
                  <span>$84</span>
                </div>
                <div className="bg-[#C47F52] py-1 text-center text-[7.5px] font-medium uppercase tracking-wider text-[#0E1913]">
                  Add to Bag
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-[#F3EDE2]/10 pt-1 text-[7px] tracking-[0.1em] uppercase text-[#F3EDE2]/45">
            <span>Cold-Pressed</span>
            <span>Edition 02</span>
          </div>
        </div>
      );

    case 'fintech':
      return (
        <div
          className={`flex h-full w-full flex-col justify-between overflow-hidden bg-[#090C11] text-[#E8EEF7] ${
            compact ? 'p-2.5' : 'p-3.5 sm:p-4'
          } ${className}`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[8px] text-[#7E8B9E]">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 bg-[#34D399]" />
              <span className="font-medium tracking-wider uppercase text-[#E8EEF7]">Treasury</span>
            </div>
            <span className="tabular-nums">UTC 14:20</span>
          </div>

          <div className="my-auto flex flex-1 flex-col justify-between gap-2 py-2">
            <div className="border border-white/10 bg-[#111620] p-2.5">
              <span className="block text-[7px] uppercase tracking-[0.14em] text-[#7E8B9E]">
                Net Liquidity
              </span>
              <p
                className={`mt-0.5 font-semibold tracking-tight text-white tabular-nums ${
                  compact ? 'text-[14px]' : 'text-[18px] sm:text-[21px]'
                }`}
              >
                $48,920,410
              </p>
              <svg viewBox="0 0 180 42" className="mt-1.5 h-8 w-full overflow-visible">
                <path
                  d="M0 36 L30 30 L60 32 L90 20 L120 22 L150 11 L180 5"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="1.6"
                />
              </svg>
            </div>

            <div className="divide-y divide-white/8 border border-white/10 bg-[#0D1118] text-[7.5px] tabular-nums">
              <div className="flex justify-between px-2 py-1.5">
                <span className="text-[#7E8B9E]">USD Operating</span>
                <span>$24,180,000</span>
              </div>
              <div className="flex justify-between px-2 py-1.5">
                <span className="text-[#7E8B9E]">EUR Clearing</span>
                <span>€16,410,500</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-white/10 pt-1 text-[7px] uppercase tracking-[0.1em] text-[#7E8B9E]">
            <span>FX Desk</span>
            <span>Multi-Corridor</span>
          </div>
        </div>
      );

    case 'hardware':
      return (
        <div
          className={`flex h-full w-full flex-col justify-between overflow-hidden bg-[#E4E5E7] text-[#151618] ${
            compact ? 'p-2.5' : 'p-3.5 sm:p-4'
          } ${className}`}
        >
          <div className="flex items-center justify-between border-b border-[#151618]/15 pb-1.5 text-[8px] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D93829]" />
              <span className="tracking-wider uppercase">Series R-01</span>
            </div>
            <span className="bg-[#D93829] px-1.5 py-0.5 text-[7px] text-white uppercase">
              Reserve
            </span>
          </div>

          <div className="my-auto flex flex-1 flex-col justify-between gap-2 py-2">
            <p
              className={`font-semibold leading-[0.95] tracking-[-0.03em] ${
                compact ? 'text-[14px]' : 'text-[18px] sm:text-[22px]'
              }`}
            >
              Reference Monitor 01
            </p>
            <div className="flex-1 overflow-hidden border border-[#151618]/15 bg-[#1C1D20]">
              <SafeMockupImg
                src="/src/assets/images/project_soraia_audio_1795538726091.jpg"
                alt="Brushed anodized aluminum studio speaker and tactile rotary dial"
                fallback="linear-gradient(135deg, #27292e, #151618)"
              />
            </div>
          </div>

          <div className="flex justify-between border-t border-[#151618]/15 pt-1 text-[7.5px] tabular-nums text-[#151618]/70">
            <span>38 Hz – 28 kHz</span>
            <span>Class-A 180W</span>
          </div>
        </div>
      );

    case 'lifestyle':
      return (
        <div
          className={`flex h-full w-full flex-col justify-between overflow-hidden bg-[#1A1310] text-[#F2E9DC] ${
            compact ? 'p-2.5' : 'p-3.5 sm:p-4'
          } ${className}`}
        >
          <div className="flex items-center justify-between border-b border-[#F2E9DC]/14 pb-1.5 text-[8px] tracking-[0.12em] uppercase">
            <span className="text-[#F2E9DC]/65">Menu</span>
            <span className="text-[#C06342]">Thu–Sun</span>
          </div>

          <div className="my-auto grid flex-1 grid-cols-12 items-stretch gap-2 py-2">
            <div className="col-span-7 overflow-hidden border border-[#F2E9DC]/12 bg-[#261C18]">
              <SafeMockupImg
                src="/src/assets/images/project_tala_dining_1795538725380.jpg"
                alt="Handmade stoneware dishes and sourdough on charred oak table"
                fallback="linear-gradient(135deg, #2a1e18, #140e0c)"
              />
            </div>
            <div className="col-span-5 flex flex-col justify-between py-0.5">
              <div>
                <span className="block text-[7px] uppercase tracking-[0.12em] text-[#C06342]">
                  Tasting
                </span>
                <p
                  className={`mt-1 font-serif leading-[1.02] ${
                    compact ? 'text-[13px]' : 'text-[16px] sm:text-[19px]'
                  }`}
                >
                  Fire, grain &amp; <span className="italic">harvest</span>.
                </p>
              </div>
              <div className="border border-[#F2E9DC]/25 py-1 text-center text-[7px] uppercase tracking-wider">
                Book Table
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-[#F2E9DC]/12 pt-1 text-[7px] tracking-[0.1em] uppercase text-[#F2E9DC]/50">
            <span>Autumn Service</span>
            <span>Table 04</span>
          </div>
        </div>
      );
  }
}
