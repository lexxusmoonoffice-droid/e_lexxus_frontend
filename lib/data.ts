export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  hoverImage?: string;
  images: string[];
  views: number;
  likes: number;
  date: string;
  material?: string;
  style?: string;
  color?: string;
  description: string;
    dimensions?: { w: number; l: number; h: number };
  fileSizeMb: number;
  formats?: string[];
};

export const products: Product[] = [
  {
    id: "1", slug: "sofa-harlem", name: "Sofa Harlem", brand: "Villevenete",
    category: "Sofas", price: 9043, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900","https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=900"],
    views: 9695, likes: 1884, date: "10.03.2026", material: "Fabric", style: "Modern", color: "Beige",
    description: "Elegant modular sofa with refined tailoring and generous proportions. Crafted for modern living rooms.",
    dimensions: { w: 240, l: 95, h: 82 }, fileSizeMb: 118.7,
  },
  {
    id: "2", slug: "wall-deco-nature", name: "SCENT OF NATURE B-6S", brand: "Wall Deco",
    category: "Decor", price: 359, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600",
    images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900"],
    views: 5784, likes: 836, date: "09.03.2026", material: "Ceramic", style: "Contemporary", color: "White",
    description: "Sculptural wall decoration inspired by natural forms.", fileSizeMb: 42.3,
  },
  {
    id: "3", slug: "office-chair-416", name: "Office Chair 416", brand: "Polflex",
    category: "Chairs", price: 1297, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600",
    images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900"],
    views: 6751, likes: 781, date: "09.03.2026", material: "Wood + Leather", style: "Modern", color: "Brown",
    description: "Ergonomic office chair with premium walnut frame and full-grain leather seat.", fileSizeMb: 76.1,
  },
  {
    id: "4", slug: "sofa-wimbledon", name: "Sofa Wimbledon", brand: "Villevenete",
    category: "Sofas", price: 9429, image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
    images: ["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900"],
    views: 6689, likes: 1187, date: "06.03.2026", material: "Leather", style: "Classic", color: "Black",
    description: "Statement three-seat sofa upholstered in full-grain black leather.", fileSizeMb: 132.4,
  },
  {
    id: "5", slug: "office-desk-xander", name: "Office Desk Xander", brand: "Arbore",
    category: "Desks", price: 0, image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900","https://images.unsplash.com/photo-1503602642458-232111445657?w=900"],
    views: 3422, likes: 610, date: "04.03.2026", material: "Wood", style: "Modern", color: "Walnut",
    description: "With its commanding presence and sculptural lines, Xander is more than a desk — it's the centerpiece of a creative and powerful workspace. Crafted with the finest oak veneer, stained in rich American Walnut.",
    dimensions: { w: 180, l: 217, h: 82 }, fileSizeMb: 118.7,
  },
  {
    id: "6", slug: "modular-sofa-achille", name: "Modular Sofa Achille", brand: "Villevenete",
    category: "Sofas", price: 7820, image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600",
    images: ["https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=900"],
    views: 4120, likes: 922, date: "02.03.2026", material: "Velvet", style: "Contemporary", color: "Grey",
    description: "Modular configuration with deep seats and soft velvet upholstery.", fileSizeMb: 95.2,
  },
  {
    id: "7", slug: "barn-house-5", name: "Barn House 5", brand: "K_Design",
    category: "Exterior", price: 1899, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900"],
    views: 2834, likes: 410, date: "01.03.2026", style: "Rustic",
    description: "Full architectural scene of a barn-style country house with landscaping.", fileSizeMb: 512.0,
  },
  {
    id: "8", slug: "neoclassical-bathroom", name: "Neoclassical Bathroom 44", brand: "Marble Studio",
    category: "Interior", price: 689, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900"],
    views: 3580, likes: 520, date: "28.02.2026", style: "Neoclassical",
    description: "Full bathroom scene with marble finishes and classical detailing.", fileSizeMb: 244.0,
  },
];

export const categories = [
  { name: "3D Models", href: "/models", sub: ["Furniture", "Lighting", "Decor", "Kitchen"] },
  { name: "3D Scenes", href: "/scenes", sub: ["Interior", "Exterior"] },
  { name: "3D Sets", href: "/sets", sub: [] },
  { name: "Textures", href: "/textures", sub: ["Wood", "Stone", "Fabric"] },
  { name: "Bundles", href: "/bundles", sub: [] },
];

export const blogPosts = [
  { slug: "multifunctional-family-space", title: "Multifunctional Family Space Redefined with Deco Line 3D Wall Panels", excerpt: "How modular panels transform shared living spaces.", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600", date: "12.03.2026" },
  { slug: "studjo-wallart-croatian", title: "Studjo Wallart: Croatian Art Transformed into Interior", excerpt: "A deep-dive into Studjo's material-first philosophy.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600", date: "10.03.2026" },
  { slug: "gyform-where-beauty-meets-comfort", title: "Gyform: Where Beauty Meets Comfort", excerpt: "Italian craftsmanship for the modern home.", image: "https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=600", date: "08.03.2026" },
  { slug: "salini-premium-materials", title: "Salini: Premium Materials and Manufacturing", excerpt: "Behind the scenes at a premium bath brand.", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600", date: "06.03.2026" },
  { slug: "fovere-sustainable-acoustics", title: "Fovere: Sustainable Acoustic Solutions Made in Poland", excerpt: "Eco-friendly sound design you can see.", image: "https://images.unsplash.com/photo-1615529162924-f8605388461d?w=600", date: "02.03.2026" },
];

export const brands = ["Villevenete", "Polflex", "Arbore", "Wall Deco", "Marble Studio", "K_Design"];

export type Bundle = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  description: string;
  image: string;
  images: string[];
  productIds: string[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  modelCount: number;
  fileSizeMb: number;
  formats: string[];
  badge?: string;
};

export const bundles: Bundle[] = [
  {
    id: "b1",
    slug: "living-room-essentials",
    name: "Living Room Essentials",
    tag: "Most Popular",
    badge: "Best Value",
    description: "Everything you need to furnish a complete living room scene. Includes three premium sofas, a statement desk, and a sculptural decor piece — all production-ready.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=85",
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85",
    ],
    productIds: ["1", "4", "6", "2"],
    originalPrice: 26271,
    bundlePrice: 17900,
    savings: 32,
    modelCount: 4,
    fileSizeMb: 388.5,
    formats: [".max", ".fbx", ".obj", ".skp"],
  },
  {
    id: "b2",
    slug: "workspace-collection",
    name: "Workspace Collection",
    tag: "New Bundle",
    description: "A curated set of office and workspace assets. Includes the Xander desk, the 416 ergonomic chair, and complementary decor — ideal for home office and studio renders.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=85",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=85",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=85",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&q=85",
    ],
    productIds: ["5", "3", "2"],
    originalPrice: 2953,
    bundlePrice: 1990,
    savings: 33,
    modelCount: 3,
    fileSizeMb: 194.1,
    formats: [".max", ".fbx", ".obj"],
  },
  {
    id: "b3",
    slug: "architectural-scenes-pack",
    name: "Architectural Scenes Pack",
    tag: "Studio Pick",
    badge: "Studio Exclusive",
    description: "Two complete architectural scenes — a rustic barn house exterior and a neoclassical bathroom interior — plus the Villevenete sofa collection for interior staging.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=900&q=85",
    ],
    productIds: ["7", "8", "6"],
    originalPrice: 10408,
    bundlePrice: 6990,
    savings: 33,
    modelCount: 3,
    fileSizeMb: 851.2,
    formats: [".max", ".fbx", ".obj", ".skp"],
  },
  {
    id: "b4",
    slug: "complete-interior-kit",
    name: "Complete Interior Kit",
    tag: "Ultimate Bundle",
    badge: "Save 40%",
    description: "The most comprehensive interior design bundle on Lexxus. All 8 flagship assets in a single download — sofas, chairs, desks, decor, and full scenes. The complete toolkit for serious visualizers.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=85",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85",
    ],
    productIds: ["1", "2", "3", "4", "5", "6", "7", "8"],
    originalPrice: 31336,
    bundlePrice: 18900,
    savings: 40,
    modelCount: 8,
    fileSizeMb: 1243.5,
    formats: [".max", ".fbx", ".obj", ".skp"],
  },
];
