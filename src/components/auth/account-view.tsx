"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/language-provider";
import { ProductCard } from "@/components/menu/product-card";
import { supabase } from "@/lib/supabase/client";
import { useFavorites } from "@/lib/supabase/favorites-provider";
import { useSession } from "@/lib/supabase/use-session";
import type { Product } from "@/lib/catalog/types";

export function AccountView({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const { ids, loading: favoritesLoading } = useFavorites();

  useEffect(() => {
    if (!sessionLoading && !user) router.replace("/login");
  }, [sessionLoading, user, router]);

  if (sessionLoading || !user) return null;

  const favoriteProducts = products.filter((product) => ids.has(`${product.kind}-${product.id}`));
  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email;

  return (
    <section className="mx-auto max-w-[110rem] px-6 pb-28 pt-32 md:px-10 md:pb-40">
      <p className="eyebrow">{t.auth.myAccount}</p>
      <h1 className="mt-6 font-display text-headline font-normal">{name}</h1>
      <p className="mt-4 text-sm text-muted">
        {t.auth.signedInAs} {user.email}
      </p>

      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="mt-8 rounded-full border border-border px-6 py-3 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
      >
        {t.auth.signOut}
      </button>

      <div className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-title font-normal">{t.auth.favorites}</h2>

        {!favoritesLoading && favoriteProducts.length === 0 && (
          <div className="mt-8">
            <p className="text-sm text-muted">{t.auth.noFavorites}</p>
            <Link
              href="/menu"
              className="mt-4 inline-block text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:decoration-accent"
            >
              {t.auth.browseMenu} →
            </Link>
          </div>
        )}

        {favoriteProducts.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard key={`${product.kind}-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
