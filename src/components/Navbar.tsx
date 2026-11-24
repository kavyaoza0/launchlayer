import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type EnquiryTopic = 'General' | 'Work' | 'Services' | 'Pricing' | 'Studio' | 'Contact';

interface NavbarProps {
  onOpenEnquiry: (topic?: EnquiryTopic) => void;
  onNavigatePresentation?: (slideIndex: number) => void;
}

const NAV_ITEMS: { label: string; topic: EnquiryTopic }[] = [
  { label: 'Work', topic: 'Work' },
  { label: 'Services', topic: 'Services' },
  { label: 'Pricing', topic: 'Pricing' },
  { label: 'Studio', topic: 'Studio' },
];

export function Navbar({ onOpenEnquiry, onNavigatePresentation }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavAction = (topic: EnquiryTopic) => {
    setMobileMenuOpen(false);
    if (topic === 'Work') {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (topic === 'Studio') {
      document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (topic === 'Services') {
      onNavigatePresentation?.(0);
      return;
    }
    if (topic === 'Pricing') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    onOpenEnquiry(topic);
  };

  return (
    <header className="relative z-20 w-full border-b border-white/10 bg-black/35 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-6 py-4 md:px-12 md:py-5 lg:px-16">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-heading text-[26px] leading-none tracking-[-0.01em] text-white whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          LaunchLayer
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavAction(item.topic)}
              className="group relative py-2 font-body text-[13.5px] font-medium tracking-[0.01em] text-white/60 transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{item.label}</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-white/80 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </button>
          ))}
        </nav>

        {/* Zone 3: Single primary action + accessible mobile menu trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenEnquiry('General')}
            className="liquid-glass-strong min-h-[40px] rounded-full px-5 py-2 font-body text-[13px] font-medium tracking-[0.01em] text-white transition-all duration-200 hover:bg-white/10 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Start a project
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-nav"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-colors hover:border-white/50 md:hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Accessible mobile dropdown menu */}
      {mobileMenuOpen && (
        <nav
          id="mobile-primary-nav"
          aria-label="Mobile Primary"
          className="border-t border-white/10 bg-black/95 px-6 py-4 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col divide-y divide-white/10">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavAction(item.topic)}
                className="flex min-h-[44px] w-full items-center justify-between py-3 text-left font-body text-[15px] font-medium text-white hover:text-white/75 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
