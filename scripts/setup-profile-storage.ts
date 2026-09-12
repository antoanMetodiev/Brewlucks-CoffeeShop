// One-time (idempotent) setup for editable profile fields + avatar storage. Run with:
// npm run db:setup-profile
import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(__dirname, ".."));

async function main() {
  const { sql } = await import("../src/lib/db");

  console.log("Adding phone/address columns to public.users…");
  await sql`alter table public.users add column if not exists phone text`;
  await sql`alter table public.users add column if not exists address text`;

  console.log("Creating avatars storage bucket…");
  await sql`
    insert into storage.buckets (id, name, public)
    values ('avatars', 'avatars', true)
    on conflict (id) do nothing
  `;

  console.log("Creating avatar storage policies…");
  await sql`drop policy if exists "avatar public read" on storage.objects`;
  await sql`create policy "avatar public read" on storage.objects for select using (bucket_id = 'avatars')`;

  await sql`drop policy if exists "avatar owner insert" on storage.objects`;
  await sql`
    create policy "avatar owner insert" on storage.objects for insert
      with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  `;

  await sql`drop policy if exists "avatar owner update" on storage.objects`;
  await sql`
    create policy "avatar owner update" on storage.objects for update
      using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  `;

  await sql`drop policy if exists "avatar owner delete" on storage.objects`;
  await sql`
    create policy "avatar owner delete" on storage.objects for delete
      using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  `;

  console.log("Done.");
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
