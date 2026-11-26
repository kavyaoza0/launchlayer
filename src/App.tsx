import { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { HeroVideoBackground } from './components/HeroVideoBackground';
import { LaunchLayerRibbon } from './components/LaunchLayerRibbon';
import { Navbar, type EnquiryTopic } from './components/Navbar';
import OfflineFooter from './components/OfflineFooter';
import { PhilosophyRevealSection } from './components/PhilosophyRevealSection';
import PricingSection from './components/PricingSection';
import { ProjectEnquiryDrawer } from './components/ProjectEnquiryDrawer';
import { StudioEditorialCarousel } from './components/StudioEditorialCarousel';
import { TesseloEntrance } from './components/TesseloEntrance';

export default function App() {
  const [entranceDone, setEntranceDone] = useState(false);
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
      {!entranceDone && <TesseloEntrance onComplete={() => setEntranceDone(true)} />}

      {/* Skip-to-content link for keyboard & screen reader users */}
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2.5 focus:text-[13px] focus:font-medium focus:text-black focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        Skip to main content
      </a>

      {/* Hero Wrapper with video background */}
      <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-black">
        <HeroVideoBackground />

        <Navbar
          onOpenEnquiry={handleOpenEnquiry}
          onNavigatePresentation={handleNavigatePresentation}
          entranceDone={entranceDone}
        />

        <HeroSection onOpenEnquiry={handleOpenEnquiry} entranceDone={entranceDone} />
      </div>

      {/* Primary Page Landmarks */}
      <main id="main-content" aria-label="Studio showcase and pricing" tabIndex={-1} className="focus:outline-none">
        {/* Interactive 3D Cylindrical Website Preview Ribbon */}
        <LaunchLayerRibbon id="work" />

        {/* Editorial Scroll-Driven Text Reveal */}
        <PhilosophyRevealSection />

        {/* Tesselo Scroll-to-Traverse Editorial Studio Carousel */}
        <StudioEditorialCarousel
          onOpenEnquiry={handleOpenEnquiry}
          requestedSlide={requestedSlide}
        />

        {/* Tesselo Pricing Section */}
        <PricingSection onSelectPackage={(topic, tierId) => handleOpenEnquiry(topic, tierId)} />
      </main>

      <OfflineFooter onOpenEnquiry={handleOpenEnquiry} />

      <ProjectEnquiryDrawer
        isOpen={enquiryOpen}
        initialTopic={enquiryTopic}
        initialTier={enquiryTier}
        onClose={() => setEnquiryOpen(false)}
      />
    </div>
  );
}
