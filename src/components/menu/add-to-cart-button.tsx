"use client";

import { useLanguage } from "@/i18n/language-provider";
import { useCart } from "@/lib/cart/cart-provider";
import type { Product } from "@/lib/catalog/types";

type Props = {
  product: Pick<Product, "kind" | "id" | "name" | "price" | "image" | "origin" | "glass">;
  compact?: boolean;
  className?: string;
};

export function AddToCartButton({ product, compact = false, className = "" }: Props) {
  const { t } = useLanguage();
  const { items, add } = useCart();
  const productId = `${product.kind}-${product.id}`;
  const inCart = items.some((row) => row.productId === productId);

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (inCart) return;
    add({
      productId,
      kind: product.kind,
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      meta: [product.origin, product.glass].filter(Boolean).join(" · ") || undefined,
    });
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={inCart}
        aria-label={inCart ? t.cart.added : t.cart.add}
        className={`flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
          inCart ? "cursor-default text-muted" : "text-accent hover:text-fg"
        } ${className}`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4h2l1.5 11.5A2 2 0 0 0 8.5 17.5h9a2 2 0 0 0 2-1.7L21 8H6"
          />
          <circle cx="9" cy="20.5" r="1.25" />
          <circle cx="17" cy="20.5" r="1.25" />
        </svg>
        {inCart ? t.cart.added : t.cart.add}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={inCart}
      className={`rounded-full border px-6 py-3.5 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-400 ease-soft ${
        inCart ? "cursor-default border-border text-muted" : "border-border hover:border-accent hover:text-accent"
      } ${className}`}
    >
      {inCart ? t.cart.added : t.cart.add}
    </button>
  );
}
