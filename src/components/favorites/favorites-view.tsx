"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import { useFavorites } from "@/lib/supabase/favorites-provider";
import type { Product } from "@/lib/catalog/types";
import { FavoritesGrid } from "./favorites-grid";

export function FavoritesView({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const { signedIn, loading } = useFavorites();

  return (
    <section className="mx-auto max-w-[110rem] px-6 pb-28 pt-32 md:px-10 md:pb-40">
      <p className="eyebrow">Brewlucks</p>
      <h1 className="mt-6 font-display text-headline font-normal">{t.auth.favorites}</h1>

      {!loading && !signedIn ? (
        <div className="mt-8">
          <p className="text-sm text-muted">{t.auth.noFavorites}</p>
          <Link
            href="/login"
            className="mt-4 inline-block text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:decoration-accent"
          >
            {t.auth.signIn} →
          </Link>
        </div>
      ) : (
        <FavoritesGrid products={products} />
      )}
    </section>
  );
}
