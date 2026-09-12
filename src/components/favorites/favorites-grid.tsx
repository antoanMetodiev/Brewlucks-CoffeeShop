"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import { ProductCard } from "@/components/menu/product-card";
import { useFavorites } from "@/lib/supabase/favorites-provider";
import type { Product } from "@/lib/catalog/types";

export function FavoritesGrid({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const { ids, loading } = useFavorites();
  const favoriteProducts = products.filter((product) => ids.has(`${product.kind}-${product.id}`));

  if (!loading && favoriteProducts.length === 0) {
    return (
      <div className="mt-8">
        <p className="text-sm text-muted">{t.auth.noFavorites}</p>
        <Link
          href="/menu"
          className="mt-4 inline-block text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:decoration-accent"
        >
          {t.auth.browseMenu} →
        </Link>
      </div>
    );
  }

  if (favoriteProducts.length === 0) return null;

  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
      {favoriteProducts.map((product) => (
        <ProductCard key={`${product.kind}-${product.id}`} product={product} />
      ))}
    </div>
  );
}
