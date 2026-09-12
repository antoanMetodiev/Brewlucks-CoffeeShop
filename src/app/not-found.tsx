import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-dvh max-w-[110rem] flex-col justify-center px-6 py-32 md:px-10">
      <p className="eyebrow">404</p>
      <h1 className="mt-6 max-w-[16ch] font-display text-headline font-normal">
        Тази страница не е в менюто. — This page isn&apos;t on the menu.
      </h1>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/menu"
          className="rounded-full bg-accent px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110"
        >
          Меню / Menu
        </Link>
        <Link
          href="/"
          className="rounded-full border border-border px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
        >
          Начало / Home
        </Link>
      </div>
    </section>
  );
}
