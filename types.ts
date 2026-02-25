
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
  | 'other'
  | 'other_ornament';

export type GenerationType = 'image';

export type ApparelStyle = 'general' | 'professional';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '3:2';

export type BackgroundType = 'white' | 'black' | 'transparent' | 'workspace' | 'studio' | 'city' | 'historic' | 'custom';

export type ImageQuality = 'hd' | '4k';
