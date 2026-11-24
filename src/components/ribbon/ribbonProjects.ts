export type RibbonTheme =
  | 'kanso'
  | 'vespera'
  | 'meridian'
  | 'soraia'
  | 'solis'
  | 'vance'
  | 'sorel'
  | 'kronos'
  | 'forma'
  | 'stratum'
  | 'monograph'
  | 'tala'
  | 'norden'
  | 'verre'
  | 'orbit'
  | 'kinetix';

export interface RibbonProject {
  id: string;
  number: string;
  title: string;
  category: string;
  url: string;
  theme: RibbonTheme;
  image?: string;
  imageAlt?: string;
}

export const RIBBON_PROJECTS: RibbonProject[] = [
  {
    id: 'kanso-atelier',
    number: '01',
    title: 'Kanso Atelier',
    category: 'Architecture',
    url: 'https://launchlayer.in/projects/kanso-atelier',
    theme: 'kanso',
    image: '/src/assets/images/project_kanso_architecture_1795538724169.jpg',
    imageAlt: 'Concrete and warm cedar architectural pavilion beside a still reflecting pool',
  },
  {
    id: 'vespera-botanica',
    number: '02',
    title: 'Vespera Botanica',
    category: 'E-Commerce',
    url: 'https://launchlayer.in/projects/vespera-botanica',
    theme: 'vespera',
    image: '/src/assets/images/project_vespera_botanical_1795538724689.jpg',
    imageAlt: 'Dark amber glass dropper bottle on basalt stone with botanical stem',
  },
  {
    id: 'meridian-ledger',
    number: '03',
    title: 'Meridian Ledger',
    category: 'Fintech SaaS',
    url: 'https://launchlayer.in/projects/meridian-ledger',
    theme: 'meridian',
  },
  {
    id: 'soraia-acoustics',
    number: '04',
    title: 'Soraia Acoustics',
    category: 'Hardware E-Commerce',
    url: 'https://launchlayer.in/projects/soraia-acoustics',
    theme: 'soraia',
    image: '/src/assets/images/project_soraia_audio_1795538726091.jpg',
    imageAlt: 'Brushed anodized aluminum studio monitor speaker and rotary dial',
  },
  {
    id: 'solis-interiors',
    number: '05',
    title: 'Solis Interiors',
    category: 'Interior Design',
    url: 'https://launchlayer.in/projects/solis-interiors',
    theme: 'solis',
    image: '/src/assets/images/ribbon_interior_loft_1795552710347.jpg',
    imageAlt: 'Limestone arches and sculptural travertine dining table in sunlit room',
  },
  {
    id: 'vance-hale',
    number: '06',
    title: 'Vance & Hale',
    category: 'Corporate Advisory',
    url: 'https://launchlayer.in/projects/vance-hale',
    theme: 'vance',
    image: '/src/assets/images/direction_corporate_studio_1795542742249.jpg',
    imageAlt: 'Modern architectural studio workspace with warm timber and glass walls',
  },
  {
    id: 'atelier-sorel',
    number: '07',
    title: 'Atelier Sorel',
    category: 'Fashion & Lifestyle',
    url: 'https://launchlayer.in/projects/atelier-sorel',
    theme: 'sorel',
    image: '/src/assets/images/ribbon_fashion_atelier_1795552711190.jpg',
    imageAlt: 'Minimalist tailored wool coat editorial inside a concrete daylight gallery',
  },
  {
    id: 'kronos-horology',
    number: '08',
    title: 'Kronos Horology',
    category: 'Luxury E-Commerce',
    url: 'https://launchlayer.in/projects/kronos-horology',
    theme: 'kronos',
    image: '/src/assets/images/ribbon_watch_ecommerce_1795552711751.jpg',
    imageAlt: 'Mechanical chronograph timepiece resting on dark slate with brass tools',
  },
  {
    id: 'forma-studio',
    number: '09',
    title: 'Forma Studio 04',
    category: 'Creative Portfolio',
    url: 'https://launchlayer.in/projects/forma-studio',
    theme: 'forma',
    image: '/src/assets/images/work_ceramic_atelier_1795542743222.jpg',
    imageAlt: 'Hand-thrown stoneware vessels arranged in warm natural side light',
  },
  {
    id: 'stratum-cloud',
    number: '10',
    title: 'Stratum Cloud',
    category: 'Developer SaaS',
    url: 'https://launchlayer.in/projects/stratum-cloud',
    theme: 'stratum',
  },
  {
    id: 'monograph-press',
    number: '11',
    title: 'Monograph Press',
    category: 'Experimental Editorial',
    url: 'https://launchlayer.in/projects/monograph-press',
    theme: 'monograph',
    image: '/src/assets/images/ribbon_editorial_exhibition_1795552711461.jpg',
    imageAlt: 'Monolithic black exhibition plinths illuminated by warm gallery lights',
  },
  {
    id: 'tala-dining',
    number: '12',
    title: 'Tala & Co.',
    category: 'Hospitality',
    url: 'https://launchlayer.in/projects/tala-co',
    theme: 'tala',
    image: '/src/assets/images/project_tala_dining_1795538725380.jpg',
    imageAlt: 'Artisan stoneware plates with sourdough and olive oil on charred oak',
  },
  {
    id: 'norden-mobility',
    number: '13',
    title: 'Norden Mobility',
    category: 'Product Showcase',
    url: 'https://launchlayer.in/projects/norden-mobility',
    theme: 'norden',
    image: '/src/assets/images/project_norden_mobility_1795538725170.jpg',
    imageAlt: 'Matte carbon urban electric bicycle in a minimalist concrete space',
  },
  {
    id: 'maison-verre',
    number: '14',
    title: 'Maison Verre',
    category: 'Fashion Editorial',
    url: 'https://launchlayer.in/projects/maison-verre',
    theme: 'verre',
    image: '/src/assets/images/direction_editorial_fashion_1795542741389.jpg',
    imageAlt: 'High-contrast editorial fashion silhouette in warm diffused studio light',
  },
  {
    id: 'orbit-settlement',
    number: '15',
    title: 'Orbit Settlement',
    category: 'Fintech Platform',
    url: 'https://launchlayer.in/projects/orbit-settlement',
    theme: 'orbit',
  },
  {
    id: 'kinetix-archive',
    number: '16',
    title: 'Kinetix Archive',
    category: 'Experimental Editorial',
    url: 'https://launchlayer.in/projects/kinetix-archive',
    theme: 'kinetix',
  },
];
