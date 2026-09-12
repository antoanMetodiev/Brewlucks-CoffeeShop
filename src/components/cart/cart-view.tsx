"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import { formatDualPrice } from "@/lib/catalog/format";
import { useCart } from "@/lib/cart/cart-provider";
import { whatsappMessageUrl } from "@/lib/site";

export function CartView() {
  const { t, lang } = useLanguage();
  const { items, total, setQty, remove, clear } = useCart();

  const checkoutUrl = whatsappMessageUrl(
    [
      t.cart.orderIntro,
      ...items.map((item) => `${item.qty}x ${item.name} — ${formatDualPrice(item.qty * item.price, lang)}`),
      "",
      `${t.cart.total}: ${formatDualPrice(total, lang)}`,
    ].join("\n"),
  );

  return (
    <section className="mx-auto max-w-3xl px-6 pb-28 pt-32 md:pb-40">
      <p className="eyebrow">Brewlucks</p>
      <h1 className="mt-6 font-display text-headline font-normal">{t.cart.title}</h1>

      {items.length === 0 ? (
        <div className="mt-12">
          <p className="text-sm text-muted">{t.cart.empty}</p>
          <Link
            href="/menu"
            className="mt-4 inline-block text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:decoration-accent"
          >
            {t.auth.browseMenu} →
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center justify-between gap-4 py-5">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg">{item.name}</p>
                  <p className="mt-1 text-xs tabular-nums text-muted">{formatDualPrice(item.price, lang)}</p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      onClick={() => setQty(item.productId, item.qty - 1)}
                      aria-label="-"
                      className="flex h-8 w-8 items-center justify-center text-fg transition-colors duration-300 hover:text-accent"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.productId, item.qty + 1)}
                      aria-label="+"
                      className="flex h-8 w-8 items-center justify-center text-fg transition-colors duration-300 hover:text-accent"
                    >
                      +
                    </button>
                  </div>

                  <span className="w-28 shrink-0 text-right text-xs tabular-nums text-muted">
                    {formatDualPrice(item.qty * item.price, lang)}
                  </span>

                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    aria-label={t.cart.remove}
                    className="text-muted transition-colors duration-300 hover:text-accent"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={clear}
              className="text-sm text-muted underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-accent hover:decoration-accent"
            >
              {t.cart.remove} {t.cart.title.toLowerCase()}
            </button>
            <p className="font-display text-title tabular-nums">
              {t.cart.total}: {formatDualPrice(total, lang)}
            </p>
          </div>

          <a
            href={checkoutUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => window.setTimeout(clear, 300)}
            className="mt-8 block w-full rounded-full bg-accent px-8 py-4 text-center text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110"
          >
            {t.cart.checkout}
          </a>
        </>
      )}
    </section>
  );
}
