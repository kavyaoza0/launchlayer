import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface TesseloEntranceProps {
  onComplete: () => void;
}

const TARGET_CHARS = ['T', 'e', 's', 's', 'e', 'l', 'o'] as const;
// Full alphabet letter pools for authentic cipher decoding (case-matched per glyph slot)
const UPPER_POOL = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const LOWER_POOL = Array.from('abcdefghijklmnopqrstuvwxyz');

// Balanced slot widths while scrambling across all letters -> refined Instrument Serif kerning on lock
const SCRAMBLE_WIDTHS = ['0.66em', '0.52em', '0.50em', '0.50em', '0.52em', '0.44em', '0.52em'] as const;
const LOCKED_WIDTHS = ['0.53em', '0.37em', '0.32em', '0.32em', '0.37em', '0.23em', '0.41em'] as const;

// Musical staggered lock cadence
const LOCK_TIMES_MS = [780, 960, 1140, 1320, 1500, 1680, 1880] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function pickNextCipherChar(prev: string, slotIdx: number): string {
  const pool = slotIdx === 0 ? UPPER_POOL : LOWER_POOL;
  const candidates = pool.filter((ch) => ch !== prev);
  return candidates[Math.floor(Math.random() * candidates.length)] || TARGET_CHARS[slotIdx];
}

export function TesseloEntrance({ onComplete }: TesseloEntranceProps) {
  const prefersReducedMotion = !!useReducedMotion();
  const [phase, setPhase] = useState<'ignition' | 'decoding' | 'locked' | 'exiting'>('ignition');
  const [lockedCount, setLockedCount] = useState(0);
  const [displayChars, setDisplayChars] = useState<string[]>([
    'X',
    'k',
    'r',
    'v',
    'q',
    'm',
    'z',
  ]);
  const [justLockedIdx, setJustLockedIdx] = useState<number | null>(null);
  const finishedRef = useRef(false);

  const finishEntrance = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    window.scrollTo({ top: 0, behavior: 'auto' });
    setPhase('exiting');
    window.setTimeout(() => {
      onComplete();
    }, prefersReducedMotion ? 160 : 780);
  }, [onComplete, prefersReducedMotion]);

  // Lock page scrolling during entrance so site always begins cleanly at Hero
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = bodyEl.style.overflow;

    htmlEl.style.overflow = 'hidden';
    bodyEl.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishEntrance();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      htmlEl.style.overflow = prevHtmlOverflow;
      bodyEl.style.overflow = prevBodyOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [finishEntrance]);

  // Orchestrate ignition -> Tesselo-only cipher scramble -> optical wave lock -> luminous hold -> exit
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayChars([...TARGET_CHARS]);
      setLockedCount(TARGET_CHARS.length);
      setPhase('locked');
      const quickTimer = window.setTimeout(finishEntrance, 380);
      return () => window.clearTimeout(quickTimer);
    }

    const startTime = performance.now();
    let lastScrambleAt = 0;
    let rafId = 0;
    let currentLocked = 0;
    let exitTimer: number | null = null;
    let switchedToDecoding = false;

    const frame = (now: number) => {
      const elapsed = now - startTime;

      if (!switchedToDecoding && elapsed >= 220) {
        switchedToDecoding = true;
        setPhase('decoding');
      }

      let nextLocked = 0;
      for (let i = 0; i < TARGET_CHARS.length; i++) {
        if (elapsed >= LOCK_TIMES_MS[i]) {
          nextLocked = i + 1;
        }
      }

      if (nextLocked > currentLocked) {
        currentLocked = nextLocked;
        setLockedCount(nextLocked);
        setJustLockedIdx(nextLocked - 1);
      }

      if (elapsed - lastScrambleAt >= 42) {
        lastScrambleAt = elapsed;
        setDisplayChars((prev) =>
          TARGET_CHARS.map((target, idx) =>
            idx < currentLocked ? target : pickNextCipherChar(prev[idx] ?? 'X', idx)
          )
        );
      }

      if (currentLocked < TARGET_CHARS.length) {
        rafId = window.requestAnimationFrame(frame);
      } else {
        setDisplayChars([...TARGET_CHARS]);
        setPhase('locked');
        exitTimer = window.setTimeout(() => {
          finishEntrance();
        }, 1250);
      }
    };

    rafId = window.requestAnimationFrame(frame);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (exitTimer !== null) window.clearTimeout(exitTimer);
    };
  }, [finishEntrance, prefersReducedMotion]);

  const isLocked = phase === 'locked' || phase === 'exiting';
  const isExiting = phase === 'exiting';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Tesselo studio entrance"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: prefersReducedMotion ? 0.16 : 0.78, ease: EASE }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* Heavy Multi-Layered Optical Atmosphere & Architectural Light Field */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Whisper-light architectural micro-dot perspective canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : isLocked ? 0.35 : 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_70%)]"
        />

        {/* Central Vertical Meridian Ignition Spark */}
        {!prefersReducedMotion && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: phase === 'ignition' ? [0, 1] : isLocked ? 0 : 0.55,
              opacity: phase === 'ignition' ? [0, 0.95] : isLocked ? 0 : 0.2,
            }}
            transition={{ duration: 0.55, ease: EASE }}
            className="absolute left-1/2 top-[16%] bottom-[16%] w-px -translate-x-1/2 origin-center bg-gradient-to-b from-transparent via-[#64CEFB] to-transparent"
          />
        )}

        {/* Rotating Architectural Orbital Rings & Precision Cardinal Ticks */}
        {!prefersReducedMotion && (
          <>
            <motion.svg
              viewBox="0 0 700 700"
              initial={{ opacity: 0, scale: 0.72, rotate: -35 }}
              animate={{
                opacity: isExiting ? 0 : isLocked ? 0.34 : 0.2,
                scale: isExiting ? 1.24 : isLocked ? 1.04 : 0.98,
                rotate: 135,
              }}
              transition={{
                opacity: { duration: 0.7, ease: EASE },
                scale: { duration: 1.2, ease: EASE },
                rotate: { duration: 4.2, ease: 'linear' },
              }}
              className="absolute left-1/2 top-1/2 h-[min(92vw,700px)] w-[min(92vw,700px)] -translate-x-1/2 -translate-y-1/2"
              fill="none"
            >
              <circle
                cx="350"
                cy="350"
                r="298"
                stroke="#64CEFB"
                strokeOpacity="0.85"
                strokeWidth="0.9"
                strokeDasharray="3 14"
              />
              <circle
                cx="350"
                cy="350"
                r="242"
                stroke="#FFFFFF"
                strokeOpacity="0.4"
                strokeWidth="0.7"
                strokeDasharray="1 18"
              />
              <line x1="350" y1="36" x2="350" y2="56" stroke="#64CEFB" strokeWidth="1.2" />
              <line x1="350" y1="644" x2="350" y2="664" stroke="#64CEFB" strokeWidth="1.2" />
              <line x1="36" y1="350" x2="56" y2="350" stroke="#64CEFB" strokeWidth="1.2" />
              <line x1="644" y1="350" x2="664" y2="350" stroke="#64CEFB" strokeWidth="1.2" />
            </motion.svg>

            <motion.svg
              viewBox="0 0 800 800"
              initial={{ opacity: 0, scale: 0.88, rotate: 45 }}
              animate={{
                opacity: isExiting ? 0 : isLocked ? 0.24 : 0.14,
                scale: isExiting ? 1.3 : 1.05,
                rotate: -105,
              }}
              transition={{
                opacity: { duration: 0.7, ease: EASE },
                scale: { duration: 1.2, ease: EASE },
                rotate: { duration: 4.2, ease: 'linear' },
              }}
              className="absolute left-1/2 top-1/2 h-[min(104vw,840px)] w-[min(104vw,840px)] -translate-x-1/2 -translate-y-1/2"
              fill="none"
            >
              <circle
                cx="400"
                cy="400"
                r="348"
                stroke="#64CEFB"
                strokeOpacity="0.55"
                strokeWidth="0.85"
                strokeDasharray="28 52"
              />
            </motion.svg>
          </>
        )}

        {/* Dual Expanding Circular Shockwave Pulses Upon Full Decode */}
        <AnimatePresence>
          {isLocked && !isExiting && !prefersReducedMotion && (
            <>
              <motion.div
                key="lock-wave-inner"
                initial={{ opacity: 0.78, scale: 0.5 }}
                animate={{ opacity: 0, scale: 1.78 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.05, ease: EASE }}
                className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#64CEFB]/70"
              />
              <motion.div
                key="lock-wave-outer"
                initial={{ opacity: 0.48, scale: 0.58 }}
                animate={{ opacity: 0, scale: 2.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.08, ease: EASE }}
                className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35"
              />
            </>
          )}
        </AnimatePresence>

        {/* Twin Expanding Horizon Light Rails */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: isExiting ? 1.15 : 1,
            opacity: isExiting ? 0 : isLocked ? 0.52 : 0.25,
          }}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute left-1/2 top-[28%] h-px w-[min(88vw,960px)] -translate-x-1/2 origin-center bg-gradient-to-r from-transparent via-[#64CEFB]/70 to-transparent"
        />
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: isExiting ? 1.15 : 1,
            opacity: isExiting ? 0 : isLocked ? 0.52 : 0.25,
          }}
          transition={{ duration: 0.9, delay: 0.06, ease: EASE }}
          className="absolute left-1/2 top-[72%] h-px w-[min(88vw,960px)] -translate-x-1/2 origin-center bg-gradient-to-r from-transparent via-[#64CEFB]/70 to-transparent"
        />
      </div>

      {/* Precision Architectural Frame Brackets & Quiet Studio Top Corners */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.65, ease: EASE }}
        className="pointer-events-none absolute inset-4 z-10 sm:inset-7 lg:inset-10"
      >
        {/* Corner hairlines */}
        <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-white/25" />
        <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-white/25" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-white/25" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-white/25" />

        {/* Quiet unboxed top corner whispers */}
        <div className="flex items-center justify-between px-4 pt-3 font-space-mono text-[10px] tracking-[0.2em] uppercase text-white/50 sm:px-5 sm:pt-3.5">
          <span>Tesselo Studio</span>
          <span className="hidden sm:inline">Ahmedabad · Worldwide</span>
        </div>
      </motion.div>

      {/* Central Monumental Cipher-Decoded "Tesselo" Stage + Glass Floor Reflection */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.94 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -28 : 0,
          scale: isExiting ? 1.07 : 1,
        }}
        transition={{ duration: 0.78, ease: EASE }}
        className="relative z-10 flex flex-col items-center px-4 text-center sm:px-8"
      >
        <div className="relative py-2">
          {/* Primary Monumental Headline */}
          <h1
            aria-label="Tesselo"
            className="relative flex items-baseline justify-center font-heading text-[clamp(4.4rem,16.5vw,13.75rem)] font-normal leading-[0.86] tracking-[-0.03em]"
          >
            {TARGET_CHARS.map((targetChar, idx) => {
              const locked = idx < lockedCount;
              const isDecodingCurrent = idx === lockedCount;
              const justLocked = justLockedIdx === idx;
              const char = displayChars[idx] ?? targetChar;

              return (
                <motion.span
                  key={idx}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    width: locked ? LOCKED_WIDTHS[idx] : SCRAMBLE_WIDTHS[idx],
                    y: locked ? 0 : isDecodingCurrent ? -1.5 : 1.5,
                    scale: justLocked ? [1.15, 1] : 1,
                  }}
                  transition={{
                    opacity: { duration: 0.45, delay: 0.08 + idx * 0.045, ease: EASE },
                    width: { duration: 0.42, ease: EASE },
                    y: { duration: 0.36, ease: EASE },
                    scale: { duration: 0.48, ease: EASE },
                  }}
                  style={{
                    textShadow: locked
                      ? isLocked
                        ? '0 0 28px rgba(255,255,255,0.68), 0 0 60px rgba(100,206,251,0.78), 0 0 116px rgba(100,206,251,0.36)'
                        : '0 0 26px rgba(100,206,251,0.88), 0 0 64px rgba(255,255,255,0.45)'
                      : isDecodingCurrent
                        ? '0 0 28px rgba(100,206,251,0.95), 0 0 54px rgba(100,206,251,0.52)'
                        : '0 0 14px rgba(100,206,251,0.34)',
                  }}
                  className={`relative inline-flex justify-center transition-colors duration-250 ${
                    locked
                      ? 'text-white'
                      : isDecodingCurrent
                        ? 'text-[#64CEFB]'
                        : 'text-[#64CEFB]/50'
                  }`}
                >
                  {char}

                  {/* Optical vertical light flare the instant each glyph locks */}
                  {justLocked && !prefersReducedMotion && (
                    <motion.span
                      initial={{ opacity: 0.95, scaleY: 0.4 }}
                      animate={{ opacity: 0, scaleY: 1.65 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 -top-5 -bottom-5 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#64CEFB] to-transparent"
                    />
                  )}

                  {/* Active optical caliper tick tracking the glyph currently resolving */}
                  {isDecodingCurrent && !prefersReducedMotion && (
                    <motion.span
                      layoutId="tesselo-decode-caliper"
                      transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-2 inset-x-1.5 h-[2px] rounded-full bg-gradient-to-r from-[#64CEFB]/40 via-white to-[#64CEFB]/40 shadow-[0_0_16px_#64CEFB]"
                    />
                  )}
                </motion.span>
              );
            })}
          </h1>

          {/* Inside-Glyph Luminous Specular Sweep Once "Tesselo" Fully Resolves */}
          {isLocked && !isExiting && !prefersReducedMotion && (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, backgroundPosition: '-60% 0%' }}
              animate={{ opacity: [0, 1, 0], backgroundPosition: '180% 0%' }}
              transition={{ duration: 0.95, ease: EASE }}
              style={{
                backgroundImage:
                  'linear-gradient(108deg, transparent 34%, rgba(100,206,251,0.95) 47%, rgba(255,255,255,1) 50%, rgba(100,206,251,0.95) 53%, transparent 66%)',
                backgroundSize: '220% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
              className="pointer-events-none absolute inset-0 flex items-baseline justify-center py-2 font-heading text-[clamp(4.4rem,16.5vw,13.75rem)] font-normal leading-[0.86] tracking-[-0.03em]"
            >
              {TARGET_CHARS.map((ch, idx) => (
                <span
                  key={idx}
                  style={{ width: LOCKED_WIDTHS[idx] }}
                  className="inline-flex justify-center"
                >
                  {ch}
                </span>
              ))}
            </motion.span>
          )}

          {/* Subtle Inverted Optical Floor Reflection Synced to Live Cipher State */}
          {!prefersReducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none relative -mt-3 h-[0.42em] overflow-hidden opacity-25 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.85)_0%,transparent_88%)]"
              style={{
                fontSize: 'clamp(4.4rem, 16.5vw, 13.75rem)',
              }}
            >
              <div className="flex origin-top -scale-y-100 items-baseline justify-center font-heading font-normal leading-[0.86] tracking-[-0.03em] blur-[1.5px]">
                {TARGET_CHARS.map((targetChar, idx) => {
                  const locked = idx < lockedCount;
                  const char = displayChars[idx] ?? targetChar;
                  return (
                    <span
                      key={idx}
                      style={{ width: locked ? LOCKED_WIDTHS[idx] : SCRAMBLE_WIDTHS[idx] }}
                      className={`inline-flex justify-center ${
                        locked ? 'text-[#64CEFB]/85' : 'text-[#64CEFB]/40'
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Clean Illuminated Baseline Meter + Editorial Subtitle Lock */}
        <div
          aria-hidden="true"
          className="relative mt-2 h-px w-[min(64vw,380px)] overflow-hidden bg-white/12"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: lockedCount / TARGET_CHARS.length }}
            transition={{ duration: 0.28, ease: EASE }}
            className="h-full w-full origin-left bg-gradient-to-r from-[#64CEFB]/70 via-white to-[#64CEFB] shadow-[0_0_16px_rgba(100,206,251,0.9)]"
          />
        </div>

        {/* Quiet Editorial Tagline Emerging Upon Full Decode */}
        <motion.p
          initial={{ opacity: 0, y: 6, letterSpacing: '0.32em' }}
          animate={{
            opacity: isLocked && !isExiting ? 0.78 : 0,
            y: isLocked && !isExiting ? 0 : 6,
            letterSpacing: isLocked ? '0.2em' : '0.32em',
          }}
          transition={{ duration: 0.65, ease: EASE }}
          className="mt-4 font-space-mono text-[10.5px] uppercase text-white/80 sm:text-[11px]"
        >
          Web Design &amp; Digital Craft
        </motion.p>
      </motion.div>

      {/* Accessible Skip control neatly inset from frame corner */}
      <button
        type="button"
        onClick={finishEntrance}
        className="fixed bottom-7 right-7 z-20 inline-flex min-h-[44px] items-center rounded-full border border-white/15 bg-white/[0.03] px-4 font-space-mono text-[11px] tracking-[0.16em] uppercase text-white/75 transition-colors hover:border-[#64CEFB]/60 hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-10 sm:right-11 lg:bottom-12 lg:right-14"
      >
        Skip
      </button>
    </motion.div>
  );
}

export default TesseloEntrance;
