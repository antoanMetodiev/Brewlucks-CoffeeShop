// Populates the Supabase `sections`/`products` tables from TheMealDB/TheCocktailDB.
// Run with: npm run db:seed
// Safe to re-run — it truncates and reinserts both tables.
import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(__dirname, ".."));

async function main() {
  const { buildCatalogFromApis } = await import("../src/lib/catalog/build-from-apis");
  const { sql } = await import("../src/lib/db");

  console.log("Fetching catalog from TheMealDB / TheCocktailDB…");
  const sections = await buildCatalogFromApis();
  const totalProducts = sections.reduce((sum, section) => sum + section.products.length, 0);
  console.log(`Fetched ${sections.length} sections, ${totalProducts} products.`);

  console.log("Ensuring schema exists…");
  await sql`
    create table if not exists sections (
      id text primary key,
      kind text not null check (kind in ('meal', 'drink')),
      position int not null,
      title_bg text not null,
      title_en text not null,
      blurb_bg text not null,
      blurb_en text not null
    )
  `;
  await sql`
    create table if not exists products (
      id text primary key,
      kind text not null check (kind in ('meal', 'drink')),
      external_id text not null,
      section_id text not null references sections(id),
      name text not null,
      image text not null,
      price numeric(6, 2) not null,
      signature boolean not null default false,
      origin text,
      glass text,
      tags text[] not null default '{}',
      ingredients jsonb not null default '[]',
      steps text[] not null default '{}'
    )
  `;
  await sql`create index if not exists products_section_id_idx on products(section_id)`;

  const sectionRows = sections.map((section) => ({
    id: section.id,
    kind: section.kind,
    position: section.position,
    title_bg: section.title.bg,
    title_en: section.title.en,
    blurb_bg: section.blurb.bg,
    blurb_en: section.blurb.en,
  }));

  const productRows = sections.flatMap((section) =>
    section.products.map((product) => ({
      id: `${product.kind}-${product.id}`,
      kind: product.kind,
      external_id: product.id,
      section_id: product.sectionId,
      name: product.name,
      image: product.image,
      price: product.price,
      signature: product.signature,
      origin: product.origin ?? null,
      glass: product.glass ?? null,
      tags: sql.array(product.tags),
      ingredients: sql.json(product.ingredients),
      steps: sql.array(product.steps),
    })),
  );

  console.log("Writing to Supabase…");
  await sql.begin(async (tx) => {
    await tx`truncate table products, sections restart identity cascade`;
    await tx`
      insert into sections ${tx(
        sectionRows,
        "id",
        "kind",
        "position",
        "title_bg",
        "title_en",
        "blurb_bg",
        "blurb_en",
      )}
    `;
    await tx`
      insert into products ${tx(
        productRows,
        "id",
        "kind",
        "external_id",
        "section_id",
        "name",
        "image",
        "price",
        "signature",
        "origin",
        "glass",
        "tags",
        "ingredients",
        "steps",
      )}
    `;
  });

  console.log(`Done — ${sectionRows.length} sections, ${productRows.length} products in Supabase.`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
