import type { EnquiryTopic } from './Navbar';

interface FooterProps {
  onOpenEnquiry: (topic?: EnquiryTopic) => void;
  onNavigatePresentation?: (slideIndex: number) => void;
}

export function Footer({ onOpenEnquiry, onNavigatePresentation }: FooterProps) {
  return (
    <footer className="ll-section-seam relative w-full overflow-hidden bg-[#050505] py-14 text-[#F0ECE7] sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 bottom-0 h-[260px] w-[760px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(159,48,53,0.12)_0%,rgba(217,155,82,0.06)_45%,transparent_72%)] blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-10 px-6 md:flex-row md:items-end md:px-12 lg:px-16">
        <div>
          <span className="font-serif text-[28px] leading-none tracking-[-0.01em] text-[#F0ECE7]">
            LaunchLayer
          </span>
          <p className="mt-2.5 text-[13px] leading-relaxed text-[#A3A3A3]">
            Independent web design &amp; engineering studio · Ahmedabad · Available Worldwide
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[13px] text-[#A3A3A3]">
          <button
            type="button"
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="min-h-[40px] py-1 transition-colors hover:text-[#E4B272] whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
          >
            Work
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })}
            className="min-h-[40px] py-1 transition-colors hover:text-[#E4B272] whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
          >
            Philosophy
          </button>
          <button
            type="button"
            onClick={() => onNavigatePresentation?.(0)}
            className="min-h-[40px] py-1 transition-colors hover:text-[#E4B272] whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
          >
            Studio Deck
          </button>
          <button
            type="button"
            onClick={() =>
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="min-h-[40px] py-1 transition-colors hover:text-[#E4B272] whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
          >
            Pricing
          </button>
          <button
            type="button"
            onClick={() => onOpenEnquiry('General')}
            className="min-h-[40px] border border-[#D99B52]/30 bg-[#120e0e] px-4 py-1.5 text-[12.5px] font-medium text-[#F0ECE7] transition-all hover:border-[#D99B52]/65 hover:bg-[#9F3035] whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
          >
            Start a project
          </button>
        </nav>
      </div>

      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t border-[#D99B52]/14 px-6 pt-6 text-[12px] text-[#8E8E8E] md:px-12 lg:px-16">
        <span>© 2026 LaunchLayer Studio</span>
        <a
          href="mailto:hello@launchlayer.in"
          className="border-b border-[#D99B52]/30 pb-0.5 text-[#F0ECE7]/80 transition-colors hover:border-[#E4B272] hover:text-[#E4B272] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0ECE7]"
        >
          hello@launchlayer.in
        </a>
      </div>
    </footer>
  );
}
