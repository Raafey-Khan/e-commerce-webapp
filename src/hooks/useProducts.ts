import { useState, useEffect } from 'react';
import type { Product } from '../types';

interface State {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts() {
  const [state, setState] = useState<State>({ products: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ products: [], loading: true, error: null });

    fetch('https://fakestoreapi.com/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json() as Promise<Product[]>;
      })
      .then((data) => {
        if (!cancelled) setState({ products: data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ products: [], loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
