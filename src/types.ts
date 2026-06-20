export interface Product {
  id: string;
  name: string;
  category: 'beard' | 'hair' | 'tools' | 'wholesale';
  priceRetail: number;       // Price in RD$ (Dominican Pesos)
  priceWholesaleMin: number; // Price in RD$ al por mayor (minimum per unit in pack)
  minWholesaleQty: number;   // Minimum quantity to apply for wholesale price
  wholesaleUnitDesc: string; // E.g., "Caja de 6 un.", "Mínimo 12 un."
  description: string;
  features: string[];
  rating: number;
  featured: boolean;
  inStock: boolean;
  imageUrl?: string;        // Optional fallback image
  media_url?: string;       // Dynamic upload url
  media_type?: 'image' | 'video'; // Media format type
  illustrationType: 'oil' | 'balm' | 'pomade' | 'spray' | 'razor' | 'comb' | 'clipper' | 'pack';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PricingMode = 'retail' | 'wholesale';

export type CategoryFilter = 'all' | 'beard' | 'hair' | 'tools' | 'wholesale';
