import { useEffect, useRef, useState } from 'react';
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
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const firstMobileLinkRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const focusTimer = window.setTimeout(() => {
      firstMobileLinkRef.current?.focus();
    }, 20);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuTriggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

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
    <header className="relative z-20 w-full border-b border-white/15 bg-black/65 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3 sm:px-8 md:gap-8 md:py-3.5 lg:px-14">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          aria-label="LaunchLayer — Back to top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex min-h-[44px] items-center font-heading text-[24px] leading-none tracking-[-0.01em] text-white whitespace-nowrap shrink-0 sm:text-[26px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
        >
          LaunchLayer
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavAction(item.topic)}
              className="group relative inline-flex min-h-[44px] items-center px-1 font-body text-[14px] font-medium tracking-[0.01em] text-white/90 transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
            >
              <span>{item.label}</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-1 bottom-2 h-px origin-left scale-x-0 bg-white transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </button>
          ))}
        </nav>

        {/* Zone 3: Single primary action + accessible mobile menu trigger */}
        <div className="flex items-center gap-2.5 shrink-0 sm:gap-3">
          <button
            type="button"
            onClick={() => onOpenEnquiry('General')}
            className="liquid-glass-strong min-h-[44px] rounded-full bg-black/45 px-4 py-2 font-body text-[13.5px] font-medium tracking-[0.01em] text-white transition-all duration-200 hover:bg-black/70 whitespace-nowrap shrink-0 cursor-pointer sm:px-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Start a project
          </button>

          <button
            ref={menuTriggerRef}
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-nav"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/80 text-white transition-colors hover:border-white/65 md:hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Accessible mobile dropdown menu */}
      {mobileMenuOpen && (
        <nav
          id="mobile-primary-nav"
          aria-label="Mobile Primary"
          className="border-t border-white/15 bg-black/95 px-5 py-3 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col divide-y divide-white/15">
            {NAV_ITEMS.map((item, idx) => (
              <button
                key={item.label}
                ref={idx === 0 ? firstMobileLinkRef : undefined}
                type="button"
                onClick={() => handleNavAction(item.topic)}
                className="flex min-h-[48px] w-full items-center justify-between rounded-md px-2 py-3 text-left font-body text-[16px] font-medium text-white hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
