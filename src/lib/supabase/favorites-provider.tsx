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

const EMPTY_LIST: string[] = [];

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// Favorites live on public.users.favorites (jsonb array of "kind-id" strings) — a profile field,
// not a separate table, so it reuses the users table's own "select/update own" RLS policies.
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, loading: sessionLoading } = useSession();
  const [favorites, setFavorites] = useState<string[]>(EMPTY_LIST);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading || !user) return;

    let active = true;
    supabase
      .from("users")
      .select("favorites")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!active) return;
        setFavorites((data?.favorites as string[] | null) ?? []);
        setLoadedFor(user.id);
      });

    return () => {
      active = false;
    };
  }, [user, sessionLoading]);

  const ids = useMemo(
    () => new Set(user && loadedFor === user.id ? favorites : EMPTY_LIST),
    [user, loadedFor, favorites],
  );
  const loading = sessionLoading || (Boolean(user) && loadedFor !== user?.id);

  const toggle = useCallback(
    async (productId: string) => {
      if (!user) return;

      const wasFavorite = ids.has(productId);
      const next = wasFavorite
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];
      setFavorites(next);
      setLoadedFor(user.id);

      const { error } = await supabase.from("users").update({ favorites: next }).eq("id", user.id);
      if (error) {
        setFavorites(favorites); // revert on failure
        setLoadedFor(user.id);
      }
    },
    [ids, favorites, user],
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
