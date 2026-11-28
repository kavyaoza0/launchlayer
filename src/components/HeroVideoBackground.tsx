import { useEffect, useRef } from 'react';

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4';

interface HeroVideoBackgroundProps {
  entranceDone?: boolean;
}

export function HeroVideoBackground({ entranceDone = true }: HeroVideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isInView = true;

    const syncPlayback = () => {
      if (motionQuery.matches || !entranceDone || !isInView || document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isInView = Boolean(entries[0]?.isIntersecting);
        syncPlayback();
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    syncPlayback();
    motionQuery.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, [entranceDone]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black contain-layout contain-paint"
    >
      <video
        ref={videoRef}
        src={HERO_VIDEO_URL}
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full transform-gpu object-cover opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
    </div>
  );
}
