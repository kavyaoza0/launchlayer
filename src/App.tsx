import { useState } from 'react';
import CtaFooter from './components/CtaFooter';
import { HeroSection } from './components/HeroSection';
import { HeroVideoBackground } from './components/HeroVideoBackground';
import { LaunchLayerRibbon } from './components/LaunchLayerRibbon';
import { Navbar, type EnquiryTopic } from './components/Navbar';
import { PhilosophyRevealSection } from './components/PhilosophyRevealSection';
import PricingSection from './components/PricingSection';
import { ProjectEnquiryDrawer } from './components/ProjectEnquiryDrawer';
import { StudioEditorialCarousel } from './components/StudioEditorialCarousel';

export default function App() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryTopic, setEnquiryTopic] = useState<EnquiryTopic>('General');
  const [enquiryTier, setEnquiryTier] = useState<string | undefined>(undefined);
  const [requestedSlide, setRequestedSlide] = useState<{ index: number; nonce: number } | null>(
    null
  );

  const handleOpenEnquiry = (topic: EnquiryTopic = 'General', tierId?: string) => {
    setEnquiryTopic(topic);
    setEnquiryTier(tierId);
    setEnquiryOpen(true);
  };

  const handleNavigatePresentation = (slideIndex: number) => {
    setRequestedSlide({ index: slideIndex, nonce: Date.now() });
  };

  return (
    <div className="w-full bg-black font-body text-white">
      {/* Skip-to-content link for keyboard & screen reader users */}
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Skip to content
      </a>

      {/* Hero Wrapper with HLS Mux video background and monochrome top/bottom black fades */}
      <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-black">
        <HeroVideoBackground />

        <Navbar
          onOpenEnquiry={handleOpenEnquiry}
          onNavigatePresentation={handleNavigatePresentation}
        />

        <HeroSection onOpenEnquiry={handleOpenEnquiry} />
      </div>

      {/* Primary Page Landmarks */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* Interactive 3D Cylindrical Website Preview Ribbon */}
        <LaunchLayerRibbon id="work" />

        {/* Editorial Scroll-Driven Text Reveal */}
        <PhilosophyRevealSection />

        {/* LaunchLayer 7-Slide Scroll-to-Traverse Editorial Studio Carousel */}
        <StudioEditorialCarousel
          onOpenEnquiry={handleOpenEnquiry}
          requestedSlide={requestedSlide}
        />

        {/* LaunchLayer Pricing Section */}
        <PricingSection onSelectPackage={(topic, tierId) => handleOpenEnquiry(topic, tierId)} />
      </main>

      <CtaFooter onOpenEnquiry={handleOpenEnquiry} />

      <ProjectEnquiryDrawer
        isOpen={enquiryOpen}
        initialTopic={enquiryTopic}
        initialTier={enquiryTier}
        onClose={() => setEnquiryOpen(false)}
      />
    </div>
  );
}
