import type { ColorOption, SizeOption, ProductVariants } from '../types';

const clothingColors: ColorOption[] = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Olive', hex: '#6b7c3a' },
];

const jewelryColors: ColorOption[] = [
  { name: 'Gold', hex: '#c9a84c' },
  { name: 'Silver', hex: '#a8a9ad' },
  { name: 'Rose Gold', hex: '#b76e79' },
];

const electronicsColors: ColorOption[] = [
  { name: 'Space Gray', hex: '#3a3a3c' },
  { name: 'Silver', hex: '#e3e4e6' },
  { name: 'Midnight', hex: '#0d0d0f' },
];

const clothingSizes: SizeOption[] = [
  { label: 'XS', status: 'available' },
  { label: 'S', status: 'available' },
  { label: 'M', status: 'low-stock' },
  { label: 'L', status: 'available' },
  { label: 'XL', status: 'sold-out' },
];

const jewelrySizes: SizeOption[] = [
  { label: '5', status: 'available' },
  { label: '6', status: 'available' },
  { label: '7', status: 'low-stock' },
  { label: '8', status: 'sold-out' },
];

const electronicsSizes: SizeOption[] = [
  { label: '64GB', status: 'available' },
  { label: '128GB', status: 'low-stock' },
  { label: '256GB', status: 'sold-out' },
];

export function getVariantsForProduct(product: { id: number; category: string; price: number }): ProductVariants {
  const seed = product.id;
  const hasSale = seed % 3 === 0;
  const salePrice = hasSale ? parseFloat((product.price * 0.8).toFixed(2)) : undefined;

  if (product.category === "women's clothing" || product.category === "men's clothing") {
    return { colors: clothingColors, sizes: clothingSizes, salePrice };
  }
  if (product.category === 'jewelery') {
    return { colors: jewelryColors, sizes: jewelrySizes, salePrice };
  }
  return { colors: electronicsColors, sizes: electronicsSizes, salePrice };
}
