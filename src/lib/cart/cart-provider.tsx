"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type CartItem = {
  productId: string; // "meal-53076" / "drink-12770"
  name: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "brewlucks-cart";
const EMPTY_CART: CartItem[] = [];
const listeners = new Set<() => void>();
let cache: CartItem[] | null = null;

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartItem[] {
  if (cache === null) cache = readStoredCart();
  return cache;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function writeCart(next: CartItem[]) {
  cache = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    const current = getSnapshot();
    const existing = current.find((row) => row.productId === item.productId);
    const next = existing
      ? current.map((row) => (row.productId === item.productId ? { ...row, qty: row.qty + qty } : row))
      : [...current, { ...item, qty }];
    writeCart(next);
  }, []);

  const remove = useCallback((productId: string) => {
    writeCart(getSnapshot().filter((row) => row.productId !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    const current = getSnapshot();
    const next =
      qty <= 0
        ? current.filter((row) => row.productId !== productId)
        : current.map((row) => (row.productId === productId ? { ...row, qty } : row));
    writeCart(next);
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    return { items, count, total, add, remove, setQty, clear };
  }, [items, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
