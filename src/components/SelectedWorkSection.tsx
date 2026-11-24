import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { EnquiryTopic } from './Navbar';

interface SelectedWorkSectionProps {
  onSelectProject: (topic: EnquiryTopic) => void;
}

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

interface WorkItem {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  spanClass: string;
  aspectClass: string;
  fallback: string;
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: 'kanso',
    title: 'Kanso Atelier',
    category: 'Architecture & Monograph',
    image: '/src/assets/images/project_kanso_architecture_1795538724169.jpg',
    alt: 'Concrete and warm cedar architectural pavilion beside reflecting pool',
    spanClass: 'lg:col-span-8',
    aspectClass: 'aspect-[16/10]',
    fallback: 'linear-gradient(135deg, #272522, #12110f)',
  },
  {
    id: 'oka-craft',
    title: 'Oka Craft',
    category: 'Objects & Storefront',
    image: '/src/assets/images/work_ceramic_atelier_1795542743222.jpg',
    alt: 'Raw stoneware vessels and brushed brass tools on dark volcanic stone',
    spanClass: 'lg:col-span-4',
    aspectClass: 'aspect-[4/5] lg:aspect-auto lg:h-full',
    fallback: 'linear-gradient(135deg, #25201c, #100e0c)',
  },
  {
    id: 'soraia',
    title: 'Soraia Sound',
    category: 'Hardware Launch',
    image: '/src/assets/images/project_soraia_audio_1795538726091.jpg',
    alt: 'Brushed anodized aluminum studio speaker and tactile rotary dial',
    spanClass: 'lg:col-span-6',
    aspectClass: 'aspect-[16/10]',
    fallback: 'linear-gradient(135deg, #24262a, #101114)',
  },
  {
    id: 'tala',
    title: 'Tala & Co.',
    category: 'Hospitality & Reservations',
    image: '/src/assets/images/project_tala_dining_1795538725380.jpg',
    alt: 'Stoneware dining plates in warm evening candlelight',
    spanClass: 'lg:col-span-6',
    aspectClass: 'aspect-[16/10]',
    fallback: 'linear-gradient(135deg, #241b17, #110d0b)',
  },
  {
    id: 'norden',
    title: 'Norden Mobility',
    category: 'Product Configurator',
    image: '/src/assets/images/project_norden_mobility_1795538725170.jpg',
    alt: 'Matte carbon urban electric bicycle in brutalist concrete gallery',
    spanClass: 'lg:col-span-12',
    aspectClass: 'aspect-[16/9] lg:aspect-[21/9]',
    fallback: 'linear-gradient(135deg, #161b22, #090b0f)',
  },
];

function WorkImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="h-full w-full" style={{ background: fallback }} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
    />
  );
}

export function SelectedWorkSection({ onSelectProject }: SelectedWorkSectionProps) {
  const shouldReduceMotion = !!useReducedMotion();

  return (
    <section
      id="selected-work"
      aria-labelledby="selected-work-heading"
      className="relative w-full border-t border-[#F0ECE7]/10 bg-[#050505] py-24 text-[#F0ECE7] md:py-32 lg:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
        <div className="border-b border-[#F0ECE7]/12 pb-12 lg:pb-16">
          <p className="mb-4 text-[12px] font-medium tracking-[0.14em] uppercase text-[#999999]">
            Selected Work
          </p>
          <h2
            id="selected-work-heading"
            className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-[#F0ECE7] [text-wrap:balance]"
          >
            A closer look at <span className="italic">what we create.</span>
          </h2>
        </div>

        {/* Asymmetric Editorial Showcase Grid */}
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 lg:mt-16 lg:grid-cols-12">
          {WORK_ITEMS.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, clipPath: 'inset(6% 0% 0% 0%)' }
              }
              whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, delay: (idx % 2) * 0.08, ease: EASE_EDITORIAL }}
              className={`group flex flex-col ${item.spanClass}`}
            >
              <button
                type="button"
                onClick={() => onSelectProject('Work')}
                className="flex h-full w-full flex-col text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9F3035]"
              >
                <div
                  className={`relative w-full flex-1 overflow-hidden border border-[#292929] bg-[#0B0C10] ${item.aspectClass}`}
                >
                  <WorkImage src={item.image} alt={item.alt} fallback={item.fallback} />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>

                <div className="mt-4 flex items-baseline justify-between border-b border-[#F0ECE7]/10 pb-3 transition-colors duration-300 group-hover:border-[#F0ECE7]/30">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-serif text-2xl font-normal text-[#F0ECE7] md:text-[28px]">
                      {item.title}
                    </h3>
                    <span className="text-[12.5px] text-[#999999]">{item.category}</span>
                  </div>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#999999] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F0ECE7]"
                  />
                </div>
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
