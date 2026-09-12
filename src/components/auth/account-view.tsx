"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLanguage } from "@/i18n/language-provider";
import { FavoritesGrid } from "@/components/favorites/favorites-grid";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/lib/supabase/use-session";
import type { Product } from "@/lib/catalog/types";

type ProfileRow = {
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
};

export function AccountView({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const fileInput = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && !user) router.replace("/login");
  }, [sessionLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase
      .from("users")
      .select("full_name, phone, address, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!active || !data) return;
        setProfile(data);
        setName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setAddress(data.address ?? "");
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (sessionLoading || !user) return null;

  const avatarUrl = avatarPreview ?? profile?.avatar_url ?? (user.user_metadata?.avatar_url as string | undefined);
  const initial = (user.email?.[0] ?? "?").toUpperCase();

  const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      let avatarUrlToSave = profile?.avatar_url ?? null;

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() || "jpg";
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        avatarUrlToSave = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: name, avatar_url: avatarUrlToSave },
      });
      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from("users")
        .update({ full_name: name, phone, address, avatar_url: avatarUrlToSave })
        .eq("id", user.id);
      if (dbError) throw dbError;

      setProfile({ full_name: name, phone, address, avatar_url: avatarUrlToSave });
      setAvatarFile(null);
      setSaved(true);
    } catch {
      setError(t.auth.genericError);
    } finally {
      setSaving(false);
    }
  };

  const displayName = (user.user_metadata?.full_name as string | undefined) || user.email;

  return (
    <section className="mx-auto max-w-[110rem] px-6 pb-28 pt-32 md:px-10 md:pb-40">
      <p className="eyebrow">{t.auth.myAccount}</p>
      <h1 className="mt-6 font-display text-headline font-normal">{displayName}</h1>
      <p className="mt-4 text-sm text-muted">
        {t.auth.signedInAs} {user.email}
      </p>

      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="mt-8 rounded-full border border-border px-6 py-3 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
      >
        {t.auth.signOut}
      </button>

      <div className="mt-16 max-w-lg border-t border-border pt-10">
        <h2 className="font-display text-title font-normal">{t.profile.edit}</h2>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="flex items-center gap-5">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border text-lg uppercase text-fg">
                {initial}
              </span>
            )}
            <div>
              <p className="eyebrow">{t.profile.avatar}</p>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="mt-2 text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-300 hover:decoration-accent"
              >
                {t.profile.changeAvatar}
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="eyebrow">
              {t.profile.name}
            </label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t.profile.namePlaceholder}
              className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted/60 focus-visible:border-accent"
            />
          </div>

          <div>
            <label htmlFor="phone" className="eyebrow">
              {t.profile.phone}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t.profile.phonePlaceholder}
              className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted/60 focus-visible:border-accent"
            />
          </div>

          <div>
            <label htmlFor="address" className="eyebrow">
              {t.profile.address}
            </label>
            <textarea
              id="address"
              rows={3}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder={t.profile.addressPlaceholder}
              className="mt-3 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted/60 focus-visible:border-accent"
            />
          </div>

          {error && <p className="text-sm text-accent">{error}</p>}
          {saved && !error && <p className="text-sm text-muted">{t.profile.saved}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t.profile.save}
          </button>
        </form>
      </div>

      <div className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-title font-normal">{t.auth.favorites}</h2>
        <FavoritesGrid products={products} />
      </div>
    </section>
  );
}
