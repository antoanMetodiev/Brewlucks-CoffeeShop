"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "@/i18n/language-provider";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/lib/supabase/use-session";

const fieldClass =
  "mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted/60 focus-visible:border-accent";

export function LoginView() {
  const { t } = useLanguage();
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (!sessionLoading && session) router.replace("/account");
  }, [sessionLoading, session, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setCheckEmail(false);

    const { error: authError, data } =
      mode === "signIn"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setSubmitting(false);

    if (authError) {
      setError(authError.message || t.auth.genericError);
      return;
    }

    if (mode === "signUp" && !data.session) {
      setCheckEmail(true);
      return;
    }

    router.push("/account");
  };

  const onGoogle = async () => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account` },
    });
    if (authError) setError(authError.message || t.auth.genericError);
  };

  return (
    <section className="mx-auto max-w-md px-6 pb-28 pt-32 md:pb-40">
      <p className="eyebrow">Brewlucks</p>
      <h1 className="mt-6 font-display text-headline font-normal">
        {mode === "signIn" ? t.auth.signIn : t.auth.signUp}
      </h1>

      <button
        type="button"
        onClick={onGoogle}
        className="mt-10 flex w-full items-center justify-center gap-3 rounded-full border border-border px-6 py-3.5 text-sm text-fg transition-colors duration-300 hover:border-accent hover:text-accent"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
          <path
            fill="currentColor"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.56-5.17 3.56-8.87Z"
          />
          <path
            fill="currentColor"
            d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24Z"
          />
          <path fill="currentColor" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.28a12 12 0 0 0 0 10.78l3.99-3.11Z" />
          <path
            fill="currentColor"
            d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.42-3.42A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.28 6.61l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
          />
        </svg>
        {t.auth.continueWithGoogle}
      </button>

      <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-muted">
        <span className="h-px flex-1 bg-border" />
        {t.auth.orDivider}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="eyebrow">
            {t.auth.email}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t.auth.emailPlaceholder}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="eyebrow">
            {t.auth.password}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signIn" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t.auth.passwordPlaceholder}
            className={fieldClass}
          />
        </div>

        {error && <p className="text-sm text-accent">{error}</p>}
        {checkEmail && <p className="text-sm text-muted">{t.auth.checkEmail}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-accent px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "signIn" ? t.auth.signInCta : t.auth.signUpCta}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode((current) => (current === "signIn" ? "signUp" : "signIn"));
          setError(null);
          setCheckEmail(false);
        }}
        className="mt-8 text-sm text-muted underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-accent hover:decoration-accent"
      >
        {mode === "signIn" ? t.auth.switchToSignUp : t.auth.switchToSignIn}
      </button>
    </section>
  );
}
