import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set — add them to .env.local.",
  );
}

// Fire-and-forget writes (cart/favorites persist() calls) don't await the request before the user
// can navigate away — a normal page navigation aborts any in-flight fetch, silently dropping the
// write and leaving the database on stale data (e.g. a removed cart item reappearing after a
// reload). `keepalive` lets the browser finish the request in the background across a navigation/
// unload, same as `navigator.sendBeacon`. Only applied to plain JSON bodies (every PostgREST
// update/insert): keepalive requests are capped at 64KB by browsers, which would silently break
// larger requests like the avatar upload's file body (FormData/Blob, left untouched here).
function keepaliveFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, typeof init?.body === "string" ? { ...init, keepalive: true } : init);
}

// Browser-only client (anon/publishable key). Row Level Security policies on `users` and
// `favorites` are what keep this safe to ship to the client — see scripts/setup-auth-schema.ts.
export const supabase = createClient(url, publishableKey, {
  global: { fetch: keepaliveFetch },
});
