// Snapshots the Supabase `sections`/`products` tables into a committed JSON file that the app
// reads at build time (src/lib/catalog/catalog.ts). One connection, one query pair — this is what
// keeps `next build`'s ~225 static pages from each opening their own connection to Supabase.
// Runs automatically via the `predev`/`prebuild` npm hooks; safe to re-run any time (e.g. after
// editing rows in Supabase) with `npm run db:sync`.
import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(__dirname, ".."));

async function main() {
  const { sql } = await import("../src/lib/db");

  console.log("Fetching catalog snapshot from Supabase…");
  const [sections, products] = await Promise.all([
    sql`select * from sections order by position`,
    sql`select * from products order by section_id, name`,
  ]);

  const outDir = path.resolve(__dirname, "../src/lib/catalog/generated");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "catalog.json"),
    JSON.stringify({ sections, products }, null, 2),
    "utf-8",
  );

  console.log(`Wrote ${sections.length} sections, ${products.length} products to generated/catalog.json`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
