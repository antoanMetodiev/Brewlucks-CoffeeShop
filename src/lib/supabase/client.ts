import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set — add them to .env.local.",
  );
}

// Browser-only client (anon/publishable key). Row Level Security policies on `users` and
// `favorites` are what keep this safe to ship to the client — see scripts/setup-auth-schema.ts.
export const supabase = createClient(url, publishableKey);
