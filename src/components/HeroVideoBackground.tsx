import { useEffect, useRef } from 'react';

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4';

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPreference = () => {
      if (motionQuery.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    syncMotionPreference();
    motionQuery.addEventListener('change', syncMotionPreference);

    return () => {
      motionQuery.removeEventListener('change', syncMotionPreference);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src={HERO_VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover opacity-100"
      />
    </div>
  );
}
