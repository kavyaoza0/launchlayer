import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { WebsiteMockup, type MockupDirection } from '../WebsiteMockups';

interface DirectionMoodboardSlideProps {
  isActive: boolean;
}

interface BoardItem {
  id: MockupDirection;
  label: string;
  baseClass: string;
  baseRotate: number;
  zIndex: number;
}

const BOARD_ITEMS: BoardItem[] = [
  {
    id: 'ecommerce',
    label: 'Commerce Storefront direction card',
    baseClass: 'left-[2%] top-[5%] h-[42%] w-[41%] sm:left-[2%] sm:top-[5%] sm:h-[46%] sm:w-[31%]',
    baseRotate: -2.2,
    zIndex: 11,
  },
  {
    id: 'architecture',
    label: 'Architecture Studio direction card',
    baseClass: 'left-[29%] top-[24%] h-[46%] w-[46%] sm:left-[31%] sm:top-[18%] sm:h-[56%] sm:w-[37%]',
    baseRotate: 0.8,
    zIndex: 14,
  },
  {
    id: 'fintech',
    label: 'Fintech Platform direction card',
    baseClass: 'right-[2%] top-[4%] h-[39%] w-[38%] sm:right-[2%] sm:top-[5%] sm:h-[44%] sm:w-[29%]',
    baseRotate: 2.4,
    zIndex: 12,
  },
  {
    id: 'hardware',
    label: 'Hardware Launch direction card',
    baseClass: 'left-[5%] bottom-[5%] h-[38%] w-[39%] sm:left-[5%] sm:bottom-[4%] sm:h-[44%] sm:w-[29%]',
    baseRotate: 1.5,
    zIndex: 13,
  },
  {
    id: 'lifestyle',
    label: 'Hospitality Lifestyle direction card',
    baseClass: 'right-[4%] bottom-[5%] h-[40%] w-[40%] sm:right-[4%] sm:bottom-[4%] sm:h-[46%] sm:w-[30%]',
    baseRotate: -1.7,
    zIndex: 15,
  },
];

interface DragState {
  id: MockupDirection | null;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  tilt: number;
}

export function DirectionMoodboardSlide({ isActive }: DirectionMoodboardSlideProps) {
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [topOrder, setTopOrder] = useState<Record<string, number>>({});
  const [zCounter, setZCounter] = useState(20);
  const [drag, setDrag] = useState<DragState>({
    id: null,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    tilt: 0,
  });

  const hasMoved = Object.values(offsets).some(
    (pos: { x: number; y: number }) => Math.abs(pos.x) > 2 || Math.abs(pos.y) > 2
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: MockupDirection) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const current = offsets[id] || { x: 0, y: 0 };
    const nextZ = zCounter + 1;
    setZCounter(nextZ);
    setTopOrder((prev) => ({ ...prev, [id]: nextZ }));
    setDrag({
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: current.x,
      origY: current.y,
      tilt: 0,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, id: MockupDirection) => {
    if (drag.id !== id) return;
    e.stopPropagation();
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    setOffsets((prev) => ({
      ...prev,
      [id]: { x: drag.origX + dx, y: drag.origY + dy },
    }));
    setDrag((prev) => ({
      ...prev,
      tilt: Math.max(-5, Math.min(5, dx * 0.04)),
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, id: MockupDirection) => {
    if (drag.id !== id) return;
    e.stopPropagation();
    setDrag({ id: null, startX: 0, startY: 0, origX: 0, origY: 0, tilt: 0 });
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, id: MockupDirection) => {
    const step = 18;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      setTopOrder((prev) => ({ ...prev, [id]: nextZ }));
      setOffsets((prev) => {
        const cur = prev[id] || { x: 0, y: 0 };
        return {
          ...prev,
          [id]: {
            x: cur.x + (e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0),
            y: cur.y + (e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0),
          },
        };
      });
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-black p-4 font-body text-white sm:p-6 md:px-10 md:py-7 lg:px-14 lg:py-8">
      {/* Soft monochrome radial studio lighting behind interactive board */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.055)_0%,transparent_74%)] blur-[96px]" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex flex-col gap-2 border-b border-white/15 pb-3.5">
        <div className="flex items-center justify-between text-[11.5px] font-medium tracking-[0.14em] uppercase text-white/75">
          <span className="text-white">05 · PLAN YOUR DIRECTION</span>
          {hasMoved ? (
            <button
              type="button"
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                setOffsets({});
              }}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/25 px-3 text-white transition-colors hover:border-white/55 hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset Board</span>
            </button>
          ) : (
            <span>Drag To Explore</span>
          )}
        </div>
        <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-end">
          <h2 className="font-heading text-[clamp(1.75rem,min(3.4vw,5.2dvh),3rem)] leading-[0.96] tracking-tight text-white">
            Your business. A <span className="italic">different</span> digital direction.
          </h2>
          <p className="max-w-[48ch] text-[13px] font-normal leading-[1.55] text-white/80 sm:text-[14px]">
            Explore a few visual possibilities. Every business has a different story, and its website
            should reflect that.
          </p>
        </div>
      </div>

      {/* Interactive Draggable Moodboard */}
      <div className="relative my-auto flex-1 overflow-visible py-2">
        {BOARD_ITEMS.map((item) => {
          const pos = offsets[item.id] || { x: 0, y: 0 };
          const isBeingDragged = drag.id === item.id;
          const rotate = isBeingDragged ? item.baseRotate + drag.tilt : item.baseRotate;
          const scale = isBeingDragged ? 1.055 : 1;
          const z = topOrder[item.id] ?? item.zIndex;

          return (
            <div
              key={item.id}
              role="group"
              tabIndex={isActive ? 0 : -1}
              aria-label={`${item.label}. Use arrow keys or drag to reposition.`}
              onKeyDown={(e) => handleCardKeyDown(e, item.id)}
              onPointerDown={(e) => handlePointerDown(e, item.id)}
              onPointerMove={(e) => handlePointerMove(e, item.id)}
              onPointerUp={(e) => handlePointerUp(e, item.id)}
              onPointerCancel={(e) => handlePointerUp(e, item.id)}
              style={{
                zIndex: z,
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${rotate}deg) scale(${scale})`,
                transition: isBeingDragged
                  ? 'box-shadow 180ms ease, border-color 180ms ease'
                  : 'transform 420ms cubic-bezier(0.22, 0.8, 0.2, 1), box-shadow 260ms ease, border-color 260ms ease',
              }}
              className={`group absolute touch-none overflow-hidden rounded-xl border bg-[#0b0b0b] select-none cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:rotate-0 hover:border-white/50 hover:shadow-[0_24px_60px_rgba(0,0,0,0.92)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                item.baseClass
              } ${isBeingDragged ? 'll-glow-border-strong' : 'll-glow-border'}`}
            >
              <WebsiteMockup direction={item.id} compact />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_48%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
