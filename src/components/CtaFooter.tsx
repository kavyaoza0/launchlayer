import { ArrowUpRight } from 'lucide-react';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';
import type { EnquiryTopic } from './Navbar';

interface CtaFooterProps {
  onOpenEnquiry?: (topic?: EnquiryTopic) => void;
}

const MUX_HLS_URL =
  'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

const CtaFooter = ({ onOpenEnquiry }: CtaFooterProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      if (motionQuery.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    const handlePlaying = () => setVideoReady(true);
    const handleError = () => setVideoReady(false);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(MUX_HLS_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, syncMotion);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setVideoReady(false);
          hls?.destroy();
          hls = null;
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = MUX_HLS_URL;
      video.addEventListener('loadedmetadata', syncMotion);
    }

    motionQuery.addEventListener('change', syncMotion);

    return () => {
      motionQuery.removeEventListener('change', syncMotion);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', syncMotion);
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  const handleBookCall = () => {
    onOpenEnquiry?.('General');
  };

  const handleViewPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-black px-6 py-32 text-center text-white md:px-16 lg:px-24">
      {/* Subtle monochrome studio radial atmosphere when video stream is unavailable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_45%,transparent_75%)]"
      />

      {/* Background HLS Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 left-0 z-[1]"
        style={{ height: '200px', background: 'linear-gradient(to bottom, black, transparent)' }}
      />
      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-[1]"
        style={{ height: '200px', background: 'linear-gradient(to top, black, transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <h2 className="mx-auto mb-4 max-w-3xl font-heading text-5xl leading-[0.85] tracking-tight text-white italic md:text-6xl lg:text-7xl">
          Your next website starts here.
        </h2>
        <p className="mx-auto mb-8 max-w-xl font-body text-sm font-light text-white/60 md:text-base">
          Book a free strategy call. See what AI&#8209;powered design can do. No commitment, no
          pressure. Just possibilities.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <button
            type="button"
            onClick={handleBookCall}
            className="liquid-glass-strong flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-white transition-all hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Book a Call
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleViewPricing}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 font-body text-sm font-medium text-black transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            View Pricing
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-32 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="font-body text-xs font-light text-white/40">
            &copy; 2026 LaunchLayer Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-body text-xs font-light text-white/40 transition-colors hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Privacy
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                handleViewPricing();
              }}
              className="font-body text-xs font-light text-white/40 transition-colors hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Terms
            </a>
            <button
              type="button"
              onClick={() => onOpenEnquiry?.('Contact')}
              className="cursor-pointer font-body text-xs font-light text-white/40 transition-colors hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CtaFooter;
