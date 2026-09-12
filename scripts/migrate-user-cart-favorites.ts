// Consolidates favorites (and adds cart) onto public.users itself, instead of a separate
// public.favorites join table — both are "profile data" and now live on the user's own row.
// Idempotent; safe to re-run. Run with: npm run db:migrate-cart-favorites
import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(__dirname, ".."));

async function main() {
  const { sql } = await import("../src/lib/db");

  console.log("Adding cart/favorites jsonb columns to public.users…");
  await sql`alter table public.users add column if not exists cart jsonb not null default '[]'::jsonb`;
  await sql`alter table public.users add column if not exists favorites jsonb not null default '[]'::jsonb`;

  const hasFavoritesTable = await sql`
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'favorites'
  `;

  if (hasFavoritesTable.length > 0) {
    console.log("Migrating any existing public.favorites rows onto public.users.favorites…");
    await sql`
      update public.users u
      set favorites = coalesce(
        (select jsonb_agg(f.product_id) from public.favorites f where f.user_id = u.id),
        '[]'::jsonb
      )
      where exists (select 1 from public.favorites f where f.user_id = u.id)
    `;

    console.log("Dropping public.favorites (superseded by public.users.favorites)…");
    await sql`drop table public.favorites`;
  }

  console.log("Done.");
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
