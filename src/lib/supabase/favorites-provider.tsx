"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "./client";
import { useSession } from "./use-session";

type FavoritesContextValue = {
  ids: Set<string>;
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
  loading: boolean;
  signedIn: boolean;
};

const EMPTY_IDS: Set<string> = new Set();

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, loading: sessionLoading } = useSession();
  const [fetchedIds, setFetchedIds] = useState<Set<string>>(EMPTY_IDS);
  const [fetchedFor, setFetchedFor] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading || !user) return;

    let active = true;
    supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!active) return;
        setFetchedIds(new Set((data ?? []).map((row) => row.product_id as string)));
        setFetchedFor(user.id);
      });

    return () => {
      active = false;
    };
  }, [user, sessionLoading]);

  const ids = user && fetchedFor === user.id ? fetchedIds : EMPTY_IDS;
  const loading = sessionLoading || (Boolean(user) && fetchedFor !== user?.id);

  const toggle = useCallback(
    async (productId: string) => {
      if (!user) return;

      const wasFavorite = ids.has(productId);
      const next = new Set(ids);
      if (wasFavorite) next.delete(productId);
      else next.add(productId);
      setFetchedIds(next);
      setFetchedFor(user.id);

      const { error } = wasFavorite
        ? await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId)
        : await supabase.from("favorites").insert({ user_id: user.id, product_id: productId });

      if (error) {
        setFetchedIds(ids); // revert on failure
        setFetchedFor(user.id);
      }
    },
    [ids, user],
  );

  const isFavorite = useCallback((productId: string) => ids.has(productId), [ids]);

  const value = useMemo(
    () => ({ ids, isFavorite, toggle, loading, signedIn: Boolean(user) }),
    [ids, isFavorite, toggle, loading, user],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
