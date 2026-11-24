export interface ShowcaseProject {
  id: string;
  title: string;
  category: string;
  year: string;
  theme: 'kanso' | 'vespera' | 'meridian' | 'soraia' | 'tala' | 'norden';
  image?: string;
  imageAlt?: string;
}

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'kanso-atelier',
    title: 'Kanso Atelier',
    category: 'Architectural Monograph',
    year: '2026',
    theme: 'kanso',
    image: '/src/assets/images/project_kanso_architecture_1795538724169.jpg',
    imageAlt: 'Concrete and warm cedar architectural pavilion beside a still reflecting pool',
  },
  {
    id: 'vespera-botanica',
    title: 'Vespera Botanica',
    category: 'E-Commerce Storefront',
    year: '2026',
    theme: 'vespera',
    image: '/src/assets/images/project_vespera_botanical_1795538724689.jpg',
    imageAlt: 'Dark amber glass dropper bottle on basalt stone with fresh botanical stem',
  },
  {
    id: 'meridian-ledger',
    title: 'Meridian Ledger',
    category: 'Fintech Web Application',
    year: '2026',
    theme: 'meridian',
  },
  {
    id: 'soraia-sound',
    title: 'Soraia Sound',
    category: 'Hardware Product Launch',
    year: '2026',
    theme: 'soraia',
    image: '/src/assets/images/project_soraia_audio_1795538726091.jpg',
    imageAlt: 'Brushed anodized aluminum studio speaker and tactile rotary volume dial',
  },
  {
    id: 'tala-dining',
    title: 'Tala & Co.',
    category: 'Hospitality Website',
    year: '2026',
    theme: 'tala',
    image: '/src/assets/images/project_tala_dining_1795538725380.jpg',
    imageAlt: 'Handmade stoneware plates with sourdough and olive oil on a charred oak table',
  },
  {
    id: 'norden-mobility',
    title: 'Norden Mobility',
    category: 'Product Configurator',
    year: '2026',
    theme: 'norden',
    image: '/src/assets/images/project_norden_mobility_1795538725170.jpg',
    imageAlt: 'Matte carbon urban electric bicycle in a minimalist concrete gallery',
  },
];
