import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: number; color: string; size: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: number; color: string; size: string; quantity: number } }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
        return { ...state, items: action.payload };

    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
              i.productId === existing.productId && i.color === existing.color && i.size === existing.size
              ? { ...i, quantity: Math.min(i.quantity + action.payload.quantity, 10) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
            (i) =>
            !(
              i.productId === action.payload.productId &&
              i.color === action.payload.color &&
              i.size === action.payload.size
            )
        ),
      };

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload.productId &&
            i.color === action.payload.color &&
            i.size === action.payload.size
            ? { ...i, quantity: Math.max(1, Math.min(action.payload.quantity, 10)) }
            : i
        ),
      };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, color: string, size: string) => void;
  updateQty: (productId: number, color: string, size: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'nua_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          dispatch({ type: 'HYDRATE', payload: JSON.parse(stored) });
        }
    } catch {
      // corrupted storage, start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, hydrated]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
          items: state.items,
          isOpen: state.isOpen,
          totalItems,
          subtotal,
          addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
          removeItem: (productId, color, size) =>
            dispatch({ type: 'REMOVE_ITEM', payload: { productId, color, size } }),
          updateQty: (productId, color, size, quantity) =>
            dispatch({ type: 'UPDATE_QTY', payload: { productId, color, size, quantity } }),
          openCart: () => dispatch({ type: 'OPEN_CART' }),
          closeCart: () => dispatch({ type: 'CLOSE_CART' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
