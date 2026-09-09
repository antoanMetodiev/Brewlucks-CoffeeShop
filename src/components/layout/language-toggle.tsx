"use client";

import { useLanguage } from "@/i18n/language-provider";
import type { Language } from "@/i18n/dictionaries";

const options: { code: Language; short: string }[] = [
  { code: "sr", short: "SR" },
  { code: "en", short: "EN" },
];

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-[0.6875rem] tracking-[0.18em]" aria-label={t.language.label}>
      {options.map((option, index) => (
        <span key={option.code} className="flex items-center gap-2">
          {index > 0 && <span className="text-border">/</span>}
          <button
            type="button"
            onClick={() => setLang(option.code)}
            aria-pressed={lang === option.code}
            aria-label={t.language[option.code]}
            className={`transition-colors duration-300 ${
              lang === option.code ? "text-accent" : "text-muted hover:text-fg"
            }`}
          >
            {option.short}
          </button>
        </span>
      ))}
    </div>
  );
}
