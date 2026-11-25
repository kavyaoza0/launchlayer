import { useCallback, useEffect, useRef, useState } from 'react';
import type { EnquiryTopic } from './Navbar';

interface OfflineFooterProps {
  onOpenEnquiry: (topic?: EnquiryTopic, tierId?: string) => void;
}

type FooterPhase = 'offline' | 'turning-on' | 'online' | 'turning-off';
type PolicyKind = 'privacy' | 'cookies' | null;

const CLIP_1080P_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/abdab52e-bb1b-477d-ae7c-26c5f8915433.mp4';
const CLIP_720P_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/15017aa7-135b-471f-a8a1-42a208bc61b2.mp4';
const POSTER_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/af6deff1-d678-4dc6-ae24-2880b16cdb20.jpg';

const SRC_W = 1920;
const SRC_H = 1080;
const CRT_X1 = 806;
const CRT_Y1 = 505;
const CRT_X2 = 1077;
const CRT_Y2 = 724;
const CRT_DOT_X = 945;
const CRT_DOT_Y = 594;

const SWITCH_ON_START_TIME = 0.6;
const ONLINE_PAUSE_TIME = 2.3;
const DOT_LAUNCH_TIME = 4.72;
const NIGHT_PAUSE_TIME = 4.92;
const DOT_FLIGHT_DURATION_MS = 780;
const POWER_HALO_DECAY_MS = 900;

interface SkyStar {
  nx: number;
  ny: number;
  size: number;
  speed: number;
  phase: number;
  nightOnly: boolean;
}

const SKY_STARS: SkyStar[] = Array.from({ length: 22 }, (_, i) => {
  const s1 = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  const s2 = Math.sin(i * 78.233 + 1.732) * 28461.1923;
  const s3 = Math.sin(i * 39.425 + 9.181) * 19283.7465;
  const f1 = s1 - Math.floor(s1);
  const f2 = s2 - Math.floor(s2);
  const f3 = s3 - Math.floor(s3);
  return {
    nx: 0.04 + f1 * 0.92,
    ny: 0.04 + f2 * 0.48,
    size: 1.5 + f3 * 2.1,
    speed: 0.9 + f3 * 1.4,
    phase: f1 * Math.PI * 2,
    nightOnly: i >= 10,
  };
});

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function OfflineFooter({ onOpenEnquiry }: OfflineFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skyCanvasRef = useRef<HTMLCanvasElement>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement>(null);
  const powerOWrapRef = useRef<HTMLSpanElement>(null);
  const policyCloseRef = useRef<HTMLButtonElement | null>(null);
  const lastPolicyTriggerRef = useRef<HTMLElement | null>(null);

  // Night (offline) is the default initial state
  const [phase, setPhase] = useState<FooterPhase>('offline');
  const phaseRef = useRef<FooterPhase>('offline');

  const [arrived, setArrived] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isCompactClip, setIsCompactClip] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 900 : false
  );
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [activePolicy, setActivePolicy] = useState<PolicyKind>(null);

  useEffect(() => {
    if (!activePolicy) {
      if (lastPolicyTriggerRef.current) {
        lastPolicyTriggerRef.current.focus();
        lastPolicyTriggerRef.current = null;
      }
      return;
    }
    lastPolicyTriggerRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => policyCloseRef.current?.focus(), 20);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePolicy(null);
      } else if (e.key === 'Tab') {
        // Trap focus within the modal close button
        e.preventDefault();
        policyCloseRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activePolicy]);

  // Flight & halo animation refs
  const dotFlightRef = useRef<{
    active: boolean;
    launchedForTurnOff: boolean;
    startMs: number;
    startPt: { x: number; y: number };
  }>({
    active: false,
    launchedForTurnOff: false,
    startMs: 0,
    startPt: { x: 0, y: 0 },
  });

  const haloFadeRef = useRef<{
    active: boolean;
    startMs: number;
  }>({
    active: false,
    startMs: 0,
  });

  const setPhaseSync = useCallback((next: FooterPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  // Track responsive clip selection (<= 900px -> 720p, > 900px -> 1080p) & reduced motion
  useEffect(() => {
    const clipMq = window.matchMedia('(max-width: 900px)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onClipChange = () => setIsCompactClip(clipMq.matches);
    const onMotionChange = () => {
      setReducedMotion(motionMq.matches);
      if (motionMq.matches) {
        setArrived(true);
      }
    };

    onClipChange();
    onMotionChange();

    clipMq.addEventListener('change', onClipChange);
    motionMq.addEventListener('change', onMotionChange);
    return () => {
      clipMq.removeEventListener('change', onClipChange);
      motionMq.removeEventListener('change', onMotionChange);
    };
  }, []);

  // IntersectionObserver arrival lift (threshold 0.35)
  useEffect(() => {
    if (reducedMotion) {
      setArrived(true);
      return;
    }
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setArrived(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // Coordinate mapper from 1920x1080 source frame through CSS cover + center bottom
  const mapSourcePoint = useCallback((vx: number, vy: number) => {
    const video = videoRef.current;
    const footer = footerRef.current;
    if (!video || !footer) {
      return { x: 0, y: 0, scale: 1 };
    }
    const vRect = video.getBoundingClientRect();
    const cRect = footer.getBoundingClientRect();
    const scale = Math.max(vRect.width / SRC_W, vRect.height / SRC_H);
    const drawW = SRC_W * scale;
    const drawH = SRC_H * scale;
    const offsetX = vRect.left - cRect.left + (vRect.width - drawW) * 0.5;
    const offsetY = vRect.top - cRect.top + (vRect.height - drawH) * 1.0;

    return {
      x: offsetX + vx * scale,
      y: offsetY + vy * scale,
      scale,
    };
  }, []);

  // Initialize video directly to the Night frame (~4.92s)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const parkOnCurrentTarget = () => {
      const targetTime =
        phaseRef.current === 'online' ? ONLINE_PAUSE_TIME : NIGHT_PAUSE_TIME;
      try {
        video.pause();
        video.currentTime = targetTime;
      } catch {
        // Ignore seek errors before stream ranges are buffered
      }
    };

    const handleLoadedMetadata = () => {
      parkOnCurrentTarget();
    };

    const handleSeeked = () => {
      if (phaseRef.current === 'offline' || phaseRef.current === 'online') {
        setVideoReady(true);
      }
    };

    const handleCanPlay = () => {
      if (
        !videoReady &&
        (phaseRef.current === 'offline' || phaseRef.current === 'online')
      ) {
        if (Math.abs(video.currentTime - NIGHT_PAUSE_TIME) > 0.25 && phaseRef.current === 'offline') {
          try {
            video.currentTime = NIGHT_PAUSE_TIME;
          } catch {
            // Ignore
          }
        } else {
          setVideoReady(true);
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('canplay', handleCanPlay);

    if (video.readyState >= 1) {
      parkOnCurrentTarget();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isCompactClip, videoReady]);

  // Continuous RAF timeline monitor + canvas rendering (sky blur, stars, scanline, glowing dot flight)
  useEffect(() => {
    let rafId = 0;

    const syncCanvasSize = (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.max(1, Math.round(w * dpr));
      const targetH = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      return ctx;
    };

    const renderFrame = (now: number) => {
      const footer = footerRef.current;
      const video = videoRef.current;
      const fxCanvas = fxCanvasRef.current;
      const skyCanvas = skyCanvasRef.current;

      if (footer && video) {
        const currentPhase = phaseRef.current;
        const cRect = footer.getBoundingClientRect();
        const width = cRect.width;
        const height = cRect.height;

        // 1. Timeline phase progression
        if (!reducedMotion) {
          if (currentPhase === 'turning-on' && video.currentTime >= ONLINE_PAUSE_TIME) {
            video.pause();
            video.currentTime = ONLINE_PAUSE_TIME;
            setPhaseSync('online');
          } else if (currentPhase === 'turning-off') {
            if (
              !dotFlightRef.current.launchedForTurnOff &&
              video.currentTime >= DOT_LAUNCH_TIME
            ) {
              dotFlightRef.current.launchedForTurnOff = true;
              dotFlightRef.current.active = true;
              dotFlightRef.current.startMs = now;
              const mapped = mapSourcePoint(CRT_DOT_X, CRT_DOT_Y);
              dotFlightRef.current.startPt = { x: mapped.x, y: mapped.y };
            }

            if (video.ended || video.currentTime >= 4.97) {
              video.pause();
              video.currentTime = NIGHT_PAUSE_TIME;
              setPhaseSync('offline');
            }
          }
        }

        // 2. Power-o halo decay (--lit: 0.9 -> 0 over 900ms after dot landing)
        if (haloFadeRef.current.active) {
          const fadeT = Math.min(1, (now - haloFadeRef.current.startMs) / POWER_HALO_DECAY_MS);
          const easedFade = 1 - Math.pow(1 - fadeT, 2);
          const litValue = Math.max(0, 0.9 * (1 - easedFade));
          footer.style.setProperty('--lit', litValue.toFixed(4));
          if (fadeT >= 1) {
            haloFadeRef.current.active = false;
            footer.style.setProperty('--lit', '0');
          }
        }

        // 3. Mobile blurred sky canvas (<= 760px)
        if (skyCanvas && width > 0 && height > 0) {
          const isMobile = width <= 760;
          const sCtx = syncCanvasSize(skyCanvas, width, height);
          if (sCtx) {
            sCtx.clearRect(0, 0, width, height);
            if (isMobile) {
              const t = video.currentTime || NIGHT_PAUSE_TIME;
              const isDayLike = t < 3.4;
              let drewVideoSky = false;

              if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
                try {
                  const sampleRows = Math.max(12, Math.floor(video.videoHeight * 0.06));
                  sCtx.save();
                  sCtx.filter = 'blur(18px)';
                  sCtx.drawImage(
                    video,
                    0,
                    0,
                    video.videoWidth,
                    sampleRows,
                    -24,
                    -24,
                    width + 48,
                    height * 0.72 + 48
                  );
                  sCtx.restore();
                  drewVideoSky = true;
                } catch {
                  drewVideoSky = false;
                }
              }

              if (!drewVideoSky) {
                const grad = sCtx.createLinearGradient(0, 0, 0, height * 0.75);
                if (isDayLike) {
                  grad.addColorStop(0, '#5d8bc4');
                  grad.addColorStop(1, '#8fb2dc');
                } else {
                  grad.addColorStop(0, '#050812');
                  grad.addColorStop(1, '#0c1328');
                }
                sCtx.fillStyle = grad;
                sCtx.fillRect(0, 0, width, height);
              }
            }
          }
        }

        // 4. Overlay FX canvas: sky star glints, online CRT scanline, glowing dot flight
        if (fxCanvas && width > 0 && height > 0) {
          const ctx = syncCanvasSize(fxCanvas, width, height);
          if (ctx) {
            ctx.clearRect(0, 0, width, height);

            // Compute night darkness factor (0 during day, 1 at night)
            const vTime = video.readyState >= 1 ? video.currentTime : NIGHT_PAUSE_TIME;
            let nightFactor = 1;
            if (vTime < 2.7) {
              nightFactor = 0;
            } else if (vTime < 4.4) {
              nightFactor = (vTime - 2.7) / (4.4 - 2.7);
            } else {
              nightFactor = 1;
            }

            if (!reducedMotion) {
              // Subtle 4-point star glints (~22 at night, ~10 faint glints during day)
              const tSec = now * 0.001;
              for (let i = 0; i < SKY_STARS.length; i++) {
                const star = SKY_STARS[i];
                const twinkle = 0.5 + 0.5 * Math.sin(tSec * star.speed + star.phase);
                const baseAlpha = star.nightOnly
                  ? nightFactor * 0.58 * Math.pow(twinkle, 1.8)
                  : (0.14 + nightFactor * 0.44) * Math.pow(twinkle, 1.6);

                if (baseAlpha <= 0.025) continue;

                const sx = star.nx * width;
                const sy = star.ny * height;
                const arm = star.size * (1.7 + twinkle * 1.4);

                ctx.save();
                ctx.translate(sx, sy);
                ctx.fillStyle = `rgba(235, 244, 255, ${baseAlpha.toFixed(3)})`;

                // 4-point diamond star glint
                ctx.beginPath();
                ctx.moveTo(0, -arm);
                ctx.lineTo(0.85, -0.85);
                ctx.lineTo(arm, 0);
                ctx.lineTo(0.85, 0.85);
                ctx.lineTo(0, arm);
                ctx.lineTo(-0.85, 0.85);
                ctx.lineTo(-arm, 0);
                ctx.lineTo(-0.85, -0.85);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
              }

              // Online idle soft white scanline sweeping down every ~1.8s clipped to CRT rect
              const showScanline =
                currentPhase === 'online' ||
                (currentPhase === 'turning-on' && vTime >= 1.75);
              if (showScanline) {
                const topLeft = mapSourcePoint(CRT_X1, CRT_Y1);
                const bottomRight = mapSourcePoint(CRT_X2, CRT_Y2);
                const crtW = bottomRight.x - topLeft.x;
                const crtH = bottomRight.y - topLeft.y;
                const bandH = Math.max(12, 52 * topLeft.scale);
                const radius = Math.max(4, 12 * topLeft.scale);

                const sweepCycle = (now % 1800) / 1800;
                const bandY = topLeft.y - bandH + sweepCycle * (crtH + bandH * 2);
                const flicker =
                  0.86 +
                  0.09 * Math.sin(now * 0.045) +
                  0.05 * Math.cos(now * 0.11);
                const peakAlpha = 0.1 * flicker;

                ctx.save();
                ctx.beginPath();
                ctx.roundRect(topLeft.x, topLeft.y, crtW, crtH, radius);
                ctx.clip();

                const scanGrad = ctx.createLinearGradient(0, bandY, 0, bandY + bandH);
                scanGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                scanGrad.addColorStop(
                  0.5,
                  `rgba(255, 255, 255, ${peakAlpha.toFixed(4)})`
                );
                scanGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.fillStyle = scanGrad;
                ctx.fillRect(topLeft.x, bandY, crtW, bandH);
                ctx.restore();
              }

              // Glowing CRT collapse point flying up into the power-o
              if (dotFlightRef.current.active && powerOWrapRef.current) {
                const elapsed = now - dotFlightRef.current.startMs;
                const t = Math.min(1, Math.max(0, elapsed / DOT_FLIGHT_DURATION_MS));
                const u = easeInOutCubic(t);

                const pRect = powerOWrapRef.current.getBoundingClientRect();
                const start = dotFlightRef.current.startPt;
                const end = {
                  x: pRect.left - cRect.left + pRect.width * 0.5,
                  y: pRect.top - cRect.top + pRect.height * 0.5,
                };
                const ctrl = {
                  x: start.x * 0.3 + end.x * 0.7 - Math.min(120, width * 0.09),
                  y: start.y * 0.35 + end.y * 0.65 - 36,
                };

                const evalBezier = (bt: number) => {
                  const inv = 1 - bt;
                  return {
                    x: inv * inv * start.x + 2 * inv * bt * ctrl.x + bt * bt * end.x,
                    y: inv * inv * start.y + 2 * inv * bt * ctrl.y + bt * bt * end.y,
                  };
                };

                const pos = evalBezier(u);
                const midArcBoost = Math.sin(Math.PI * t);
                const coreRadius = 2.8 + 1.8 * midArcBoost;
                const haloRadius = coreRadius * 6 * (0.7 + 0.6 * midArcBoost);

                // Subtle trailing spark tail
                for (let s = 4; s >= 1; s--) {
                  const tu = Math.max(0, u - s * 0.025);
                  const tailPos = evalBezier(tu);
                  const tailAlpha = (1 - s / 5) * 0.32;
                  ctx.beginPath();
                  ctx.arc(tailPos.x, tailPos.y, coreRadius * (1 - s * 0.14), 0, Math.PI * 2);
                  ctx.fillStyle = `rgba(220, 236, 255, ${tailAlpha.toFixed(3)})`;
                  ctx.fill();
                }

                // 6x radial bloom halo
                const haloGrad = ctx.createRadialGradient(
                  pos.x,
                  pos.y,
                  0,
                  pos.x,
                  pos.y,
                  haloRadius
                );
                haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                haloGrad.addColorStop(0.28, 'rgba(220, 234, 255, 0.55)');
                haloGrad.addColorStop(0.65, 'rgba(185, 212, 255, 0.16)');
                haloGrad.addColorStop(1, 'rgba(185, 212, 255, 0)');

                ctx.beginPath();
                ctx.arc(pos.x, pos.y, haloRadius, 0, Math.PI * 2);
                ctx.fillStyle = haloGrad;
                ctx.fill();

                // Crisp bright core
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, coreRadius, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();

                if (t >= 1) {
                  dotFlightRef.current.active = false;
                  haloFadeRef.current.active = true;
                  haloFadeRef.current.startMs = now;
                  footer.style.setProperty('--lit', '0.9');
                }
              }
            }
          }
        }
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    rafId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(rafId);
  }, [mapSourcePoint, reducedMotion, setPhaseSync]);

  // Power button click handler (ignores clicks mid-transition)
  const handlePowerToggle = () => {
    const current = phaseRef.current;
    if (current === 'turning-on' || current === 'turning-off') {
      return;
    }

    const video = videoRef.current;
    if (!video || reducedMotion) {
      // Static toggle for reduced-motion users
      const next = current === 'offline' ? 'online' : 'offline';
      if (video) {
        try {
          video.pause();
          video.currentTime = next === 'online' ? ONLINE_PAUSE_TIME : NIGHT_PAUSE_TIME;
        } catch {
          // Ignore
        }
      }
      setPhaseSync(next);
      return;
    }

    if (current === 'offline') {
      // Night -> Day (switch-on from 0.6s -> pause at 2.3s color bars)
      setVideoReady(true);
      setPhaseSync('turning-on');
      try {
        video.currentTime = SWITCH_ON_START_TIME;
        video.playbackRate = 1;
        void video.play();
      } catch {
        setPhaseSync('online');
      }
    } else {
      // Online -> Turning off (2.3s -> 5.0s dusk, collapse, glowing dot into power-o)
      dotFlightRef.current.active = false;
      dotFlightRef.current.launchedForTurnOff = false;
      setPhaseSync('turning-off');
      try {
        if (video.currentTime < ONLINE_PAUSE_TIME - 0.1 || video.currentTime > 2.6) {
          video.currentTime = ONLINE_PAUSE_TIME;
        }
        video.playbackRate = 1;
        void video.play();
      } catch {
        setPhaseSync('offline');
      }
    }
  };

  const isOnlinePressed = phase === 'online' || phase === 'turning-on';
  const clipUrl = isCompactClip ? CLIP_720P_URL : CLIP_1080P_URL;

  return (
    <footer
      ref={footerRef}
      data-arrived={arrived ? 'true' : 'false'}
      aria-label="LaunchLayer Footer"
      className="offline-footer ll-section-seam relative h-[min(100dvh,920px)] min-h-[580px] w-full overflow-hidden bg-[#060913] text-white"
    >
      {/* Screen-reader announcement for CRT scene power state */}
      <div className="sr-only" aria-live="polite">
        {phase === 'online'
          ? 'Monitor powered on: daylight scene active.'
          : phase === 'offline'
          ? 'Monitor powered off: night scene active.'
          : ''}
      </div>

      {/* Mobile blurred sky extension canvas */}
      <canvas
        ref={skyCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      {/* Full-bleed locked-off hill & CRT computer clip (starts on night frame by default) */}
      <video
        ref={videoRef}
        key={clipUrl}
        src={clipUrl}
        poster={reducedMotion ? POSTER_URL : undefined}
        crossOrigin="anonymous"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        className={`offline-video-el pointer-events-none z-[1] transition-opacity duration-500 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Canvas overlay for star glints, CRT scanline sweep, and glowing dot flight */}
      <canvas
        ref={fxCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      />

      {/* Atmospheric top sky scrim ensuring WCAG contrast in both night and daylight scenes */}
      <div aria-hidden="true" className="offline-sky-scrim" />

      {/* Footer Editorial Grid */}
      <div className="offline-footer-grid relative z-[3]">
        {/* Brand Column */}
        <div className="offline-brand-col">
          <div className="offline-rise" style={{ '--stagger': '0ms' } as React.CSSProperties}>
            <button
              type="button"
              onClick={handlePowerToggle}
              aria-pressed={isOnlinePressed}
              aria-label={
                isOnlinePressed
                  ? 'LaunchLayer — Power off vintage CRT monitor and return to night scene'
                  : 'LaunchLayer — Power on vintage CRT monitor'
              }
              className="offline-wordmark-btn rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#060913]"
            >
              <span>LaunchLayer</span>
              <span ref={powerOWrapRef} className="offline-power-o-wrap">
                <span className="offline-power-halo" aria-hidden="true" />
                <svg
                  viewBox="0 0 50 62"
                  className="h-full w-full overflow-visible"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M14.2 22.6 A19 19 0 1 0 35.8 22.6"
                    stroke="currentColor"
                    strokeWidth="4.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M25 6.5 V33"
                    stroke="currentColor"
                    strokeWidth="4.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
          </div>

          <p
            className="offline-tagline offline-rise"
            style={{ '--stagger': '60ms' } as React.CSSProperties}
          >
            Independent web design &amp; development studio. Crafted in Ahmedabad, partnering
            worldwide.
          </p>

          <p
            className="offline-copyright offline-rise"
            style={{ '--stagger': '120ms' } as React.CSSProperties}
          >
            © 2026 LaunchLayer. All rights reserved.
          </p>
        </div>

        {/* Studio Column */}
        <div>
          <h2
            className="offline-col-heading offline-rise"
            style={{ '--stagger': '120ms' } as React.CSSProperties}
          >
            Studio
          </h2>
          <ul className="offline-link-list">
            <li className="offline-rise" style={{ '--stagger': '180ms' } as React.CSSProperties}>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('work');
                }}
                className="offline-link"
              >
                Selected Work
              </a>
            </li>
            <li className="offline-rise" style={{ '--stagger': '240ms' } as React.CSSProperties}>
              <a
                href="#studio"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('studio');
                }}
                className="offline-link"
              >
                Philosophy
              </a>
            </li>
            <li className="offline-rise" style={{ '--stagger': '300ms' } as React.CSSProperties}>
              <a
                href="#presentation"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('presentation');
                }}
                className="offline-link"
              >
                How We Work
              </a>
            </li>
            <li className="offline-rise" style={{ '--stagger': '360ms' } as React.CSSProperties}>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('pricing');
                }}
                className="offline-link"
              >
                Pricing
              </a>
            </li>
          </ul>
        </div>

        {/* Connect Column */}
        <div>
          <h2
            className="offline-col-heading offline-rise"
            style={{ '--stagger': '180ms' } as React.CSSProperties}
          >
            Connect
          </h2>
          <ul className="offline-link-list">
            <li className="offline-rise" style={{ '--stagger': '240ms' } as React.CSSProperties}>
              <button
                type="button"
                onClick={() => onOpenEnquiry('General')}
                className="offline-link cursor-pointer bg-transparent text-left"
              >
                Start a Project
              </button>
            </li>
            <li className="offline-rise" style={{ '--stagger': '300ms' } as React.CSSProperties}>
              <a href="mailto:hello@launchlayer.in" className="offline-link">
                hello@launchlayer.in
              </a>
            </li>
            <li className="offline-rise" style={{ '--stagger': '360ms' } as React.CSSProperties}>
              <button
                type="button"
                onClick={() => setActivePolicy('privacy')}
                className="offline-link cursor-pointer bg-transparent text-left"
              >
                Privacy Policy
              </button>
            </li>
            <li className="offline-rise" style={{ '--stagger': '420ms' } as React.CSSProperties}>
              <button
                type="button"
                onClick={() => setActivePolicy('cookies')}
                className="offline-link cursor-pointer bg-transparent text-left"
              >
                Cookie Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Social Media Column */}
        <div>
          <h2
            className="offline-col-heading offline-rise"
            style={{ '--stagger': '240ms' } as React.CSSProperties}
          >
            Social Media
          </h2>
          <ul className="offline-link-list">
            <li className="offline-rise" style={{ '--stagger': '300ms' } as React.CSSProperties}>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn (opens in a new tab)"
                className="offline-link"
              >
                LinkedIn
              </a>
            </li>
            <li className="offline-rise" style={{ '--stagger': '360ms' } as React.CSSProperties}>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (opens in a new tab)"
                className="offline-link"
              >
                Instagram
              </a>
            </li>
            <li className="offline-rise" style={{ '--stagger': '420ms' } as React.CSSProperties}>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X, formerly Twitter (opens in a new tab)"
                className="offline-link"
              >
                X (Twitter)
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Accessible Legal Info Modal */}
      {activePolicy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-dialog-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setActivePolicy(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/20 bg-[#080b14] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 id="policy-dialog-title" className="font-serif text-2xl font-normal text-white">
                {activePolicy === 'privacy' ? 'Privacy Policy' : 'Cookie Policy'}
              </h3>
              <button
                ref={policyCloseRef}
                type="button"
                onClick={() => setActivePolicy(null)}
                className="min-h-[44px] rounded-full border border-white/25 px-4 py-2 text-xs font-medium text-white transition hover:border-white/60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Close
              </button>
            </div>
            <p className="text-sm leading-relaxed text-white/85">
              {activePolicy === 'privacy'
                ? 'LaunchLayer collects only project enquiry details you explicitly submit via email or our enquiry form. We never sell personal data or track browsing across third-party websites.'
                : 'This LaunchLayer website uses strictly necessary browser state to preserve smooth animation, playback, and accessibility preferences. No third-party advertising cookies are stored.'}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}

export default OfflineFooter;
