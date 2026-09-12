"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "./client";
import { useSession } from "./use-session";

export type Profile = {
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
};

type ProfileContextValue = {
  profile: Profile | null;
  loading: boolean;
  update: (patch: Partial<Profile>) => Promise<{ error: unknown }>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

// public.users is the durable source of truth for profile display (avatar/name) — NOT
// supabase.auth's user_metadata. For OAuth accounts (Google), Supabase re-syncs user_metadata
// from the provider's own claims on every sign-in/token refresh, silently overwriting whatever a
// user set through our own profile form (e.g. their custom avatar reverts to the Google photo).
// We still write to auth.updateUser too (so anything else reading user_metadata stays current),
// but the app itself always reads from `profile` here.
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading || !user) return;

    let active = true;
    supabase
      .from("users")
      .select("full_name, phone, address, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!active) return;
        setProfile(data ?? null);
        setLoadedFor(user.id);
      });

    return () => {
      active = false;
    };
  }, [user, sessionLoading]);

  const loading = sessionLoading || (Boolean(user) && loadedFor !== user?.id);

  const update = useCallback(
    async (patch: Partial<Profile>) => {
      if (!user) return { error: new Error("Not signed in") };

      // Keep auth's user_metadata in sync for name/avatar, since other tooling may read it —
      // but this is best-effort; our own UI never depends on it (see note above).
      const authPatch: Record<string, unknown> = {};
      if (patch.full_name !== undefined) authPatch.full_name = patch.full_name;
      if (patch.avatar_url !== undefined) authPatch.avatar_url = patch.avatar_url;
      if (Object.keys(authPatch).length > 0) {
        await supabase.auth.updateUser({ data: authPatch });
      }

      const { error } = await supabase.from("users").update(patch).eq("id", user.id);
      if (!error) {
        setProfile((current) => ({
          full_name: null,
          phone: null,
          address: null,
          avatar_url: null,
          ...current,
          ...patch,
        }));
        setLoadedFor(user.id);
      }
      return { error };
    },
    [user],
  );

  const value = useMemo(() => ({ profile, loading, update }), [profile, loading, update]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
}
