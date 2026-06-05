export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type StockStatus = 'available' | 'low-stock' | 'sold-out';

export interface SizeOption {
  label: string;
  status: StockStatus;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface ProductVariants {
  colors: ColorOption[];
  sizes: SizeOption[];
  salePrice?: number;
}

export interface SelectedVariant {
  color: string;
  size: string;
}

export interface CartItem {
  productId: number;
  title: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}
