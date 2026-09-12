// One-time (idempotent) setup of the auth-related schema: a public.users profile row per
// auth.users row (kept in sync via trigger), and a public.favorites join table. Run with:
// npm run db:setup-auth
import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(__dirname, ".."));

async function main() {
  const { sql } = await import("../src/lib/db");

  console.log("Creating public.users…");
  await sql`
    create table if not exists public.users (
      id uuid primary key references auth.users(id) on delete cascade,
      email text not null,
      full_name text,
      avatar_url text,
      created_at timestamptz not null default now()
    )
  `;
  await sql`alter table public.users enable row level security`;
  await sql`drop policy if exists "select own" on public.users`;
  await sql`create policy "select own" on public.users for select using (auth.uid() = id)`;
  await sql`drop policy if exists "update own" on public.users`;
  await sql`create policy "update own" on public.users for update using (auth.uid() = id)`;

  console.log("Creating handle_new_user trigger…");
  await sql`
    create or replace function public.handle_new_user()
    returns trigger as $$
    begin
      insert into public.users (id, email, full_name, avatar_url)
      values (
        new.id,
        new.email,
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'avatar_url'
      )
      on conflict (id) do nothing;
      return new;
    end;
    $$ language plpgsql security definer set search_path = public
  `;
  await sql`drop trigger if exists on_auth_user_created on auth.users`;
  await sql`
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user()
  `;

  console.log("Creating public.favorites…");
  await sql`
    create table if not exists public.favorites (
      user_id uuid not null references auth.users(id) on delete cascade,
      product_id text not null,
      created_at timestamptz not null default now(),
      primary key (user_id, product_id)
    )
  `;
  await sql`alter table public.favorites enable row level security`;
  await sql`drop policy if exists "select own favorites" on public.favorites`;
  await sql`create policy "select own favorites" on public.favorites for select using (auth.uid() = user_id)`;
  await sql`drop policy if exists "insert own favorites" on public.favorites`;
  await sql`create policy "insert own favorites" on public.favorites for insert with check (auth.uid() = user_id)`;
  await sql`drop policy if exists "delete own favorites" on public.favorites`;
  await sql`create policy "delete own favorites" on public.favorites for delete using (auth.uid() = user_id)`;

  console.log("Done.");
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
