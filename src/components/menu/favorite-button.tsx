"use client";

import { useRouter } from "next/navigation";
import { useFavorites } from "@/lib/supabase/favorites-provider";

type Props = {
  productId: string;
  className?: string;
};

export function FavoriteButton({ productId, className = "" }: Props) {
  const router = useRouter();
  const { isFavorite, toggle, signedIn } = useFavorites();
  const active = isFavorite(productId);

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!signedIn) {
      router.push("/login");
      return;
    }
    toggle(productId);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-bg/80 text-fg backdrop-blur transition-all duration-300 ease-soft hover:scale-110 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`h-4 w-4 transition-colors duration-300 ${active ? "fill-accent stroke-accent" : "fill-none stroke-current"}`}
        strokeWidth="1.75"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.5s-7.5-4.6-10-9.2C.6 8.1 2 4.8 5.2 4.1c2-.4 4 .5 5.3 2.3l1.5 2 1.5-2c1.3-1.8 3.3-2.7 5.3-2.3 3.2.7 4.6 4 3.2 7.2-2.5 4.6-10 9.2-10 9.2Z"
        />
      </svg>
    </button>
  );
}
