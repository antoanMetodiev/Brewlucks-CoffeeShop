"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/lib/supabase/use-session";
import type { ProductKind } from "@/lib/catalog/types";

export type CartItem = {
  productId: string; // "meal-53076" / "drink-12770" — unique key
  kind: ProductKind;
  id: string; // external id, for linking to the product detail page
  name: string;
  image: string;
  price: number;
  meta?: string; // origin / glass — shown as a secondary line
  qty: number;
};

const STORAGE_KEY = "brewlucks-cart";

function readLocalCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // private mode / storage disabled — cart just won't survive a reload for guests
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// Signed-in: the cart lives on public.users.cart (same profile-data pattern as favorites), so it
// follows the account rather than the browser. Signed-out: falls back to localStorage, and gets
// merged into the account's cart the moment the guest signs in.
export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: sessionLoading } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (sessionLoading) return;

    let active = true;
    (async () => {
      if (!user) {
        const local = readLocalCart();
        if (active) setItems(local);
        return;
      }

      const { data } = await supabase.from("users").select("cart").eq("id", user.id).single();
      if (!active) return;

      const dbCart = (data?.cart as CartItem[] | null) ?? [];
      const localCart = readLocalCart();
      if (localCart.length === 0) {
        setItems(dbCart);
        return;
      }

      const merged = new Map(dbCart.map((item) => [item.productId, item]));
      for (const item of localCart) {
        const existing = merged.get(item.productId);
        merged.set(item.productId, existing ? { ...existing, qty: existing.qty + item.qty } : item);
      }
      const mergedItems = [...merged.values()];
      setItems(mergedItems);
      writeLocalCart([]);
      await supabase.from("users").update({ cart: mergedItems }).eq("id", user.id);
    })();

    return () => {
      active = false;
    };
  }, [user, sessionLoading]);

  const persist = useCallback(
    (next: CartItem[]) => {
      setItems(next);
      if (user) {
        supabase
          .from("users")
          .update({ cart: next })
          .eq("id", user.id)
          .then(({ error }) => {
            if (error) console.error("Failed to save cart:", error);
          });
      } else {
        writeLocalCart(next);
      }
    },
    [user],
  );

  const add = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1) => {
      const existing = items.find((row) => row.productId === item.productId);
      const next = existing
        ? items.map((row) => (row.productId === item.productId ? { ...row, qty: row.qty + qty } : row))
        : [...items, { ...item, qty }];
      persist(next);
    },
    [items, persist],
  );

  const remove = useCallback(
    (productId: string) => persist(items.filter((row) => row.productId !== productId)),
    [items, persist],
  );

  const setQty = useCallback(
    (productId: string, qty: number) => {
      const next =
        qty <= 0
          ? items.filter((row) => row.productId !== productId)
          : items.map((row) => (row.productId === productId ? { ...row, qty } : row));
      persist(next);
    },
    [items, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

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
