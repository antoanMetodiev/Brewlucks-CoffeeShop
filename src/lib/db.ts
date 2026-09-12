import postgres from "postgres";

// Build-time only: every page in this app is statically generated, so this connection is opened
// while running `next build` (a Node.js process), never inside the deployed Cloudflare Worker.
const globalForSql = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set — add it to .env.local (see .env.example).");
  }
  // max: 1 keeps each build worker's own connection footprint small against the pooler's limit —
  // this app only ever runs short build-time queries, never concurrent per-request traffic.
  return postgres(url, { ssl: "require", prepare: false, max: 1 });
}

export const sql = globalForSql.sql ?? createClient();

if (process.env.NODE_ENV !== "production") globalForSql.sql = sql;
