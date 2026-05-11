/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductMockup {
  id: string;
  name: string;
  category: 'Apparel' | 'Accessories' | 'Home';
  imageUrl: string;
  logoPosition: {
    x: number; // 0-1 percentage
    y: number; // 0-1 percentage
    width: number; // 0-1 percentage
    rotation: number; // degrees
  };
  blendMode: GlobalCompositeOperation;
  opacity: number;
}

export const PRODUCTS: ProductMockup[] = [
  {
    id: 'tshirt-white',
    name: 'Essential Tee',
    category: 'Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000',
    logoPosition: { x: 0.5, y: 0.4, width: 0.25, rotation: 0 },
    blendMode: 'multiply',
    opacity: 0.85
  },
  {
    id: 'hoodie-black',
    name: 'Urban Hoodie',
    category: 'Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000',
    logoPosition: { x: 0.5, y: 0.45, width: 0.2, rotation: 0 },
    blendMode: 'screen', // Better for dark fabric
    opacity: 0.9
  },
  {
    id: 'mug-white',
    name: 'Cafe Mug',
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000',
    logoPosition: { x: 0.45, y: 0.5, width: 0.15, rotation: 0 },
    blendMode: 'multiply',
    opacity: 0.8
  },
  {
    id: 'tote-natural',
    name: 'Canvas Tote',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000',
    logoPosition: { x: 0.5, y: 0.55, width: 0.3, rotation: 0 },
    blendMode: 'multiply',
    opacity: 0.75
  }
];
