import { useState, useEffect } from 'react';
import type { Product } from '../types';

interface State {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(id: string | undefined) {
  const [state, setState] = useState<State>({ product: null, loading: true, error: null });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState({ product: null, loading: true, error: null });

    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json() as Promise<Product>;
      })
      .then((data) => {
        if (!cancelled) setState({ product: data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ product: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
