

export interface ImageFile {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export type Category = 'women' | 'men' | 'kids' | 'ecommerce';

export type ProductType =
  | 'jewelry'
  | 'purse'
  | 'perfume'
  | 'apparel'
  | 'watch'
  | 'belt'
  | 'toys'
  | 'home-and-kitchen'
  | 'electronics'
  // FIX: Add 'furniture' product type to support it in the e-commerce category.
  | 'furniture'
  | 'other';

export type GenerationType = 'image' | 'video' | 'ad-film';

export type ApparelStyle = 'general' | 'professional';