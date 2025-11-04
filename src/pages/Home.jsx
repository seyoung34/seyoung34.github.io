// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { pages } from "../config/pages";

export default function Home() {
  const destinations = pages.filter((page) => page.path !== "/");

  return (
    <main className="flex min-h-screen flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <header className="mb-12 space-y-4 text-center sm:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 sm:text-sm">
            welcome
          </p>
          <h1 className="font-title text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
            한눈에 살펴보는 인터랙티브 플레이그라운드
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
            카드 썸네일을 눌러 각 페이지로 이동하세요. 모바일과 데스크톱 모두에서 자연스럽게
            동작하도록 설계된 반응형 인터페이스입니다.
          </p>
        </header>

        <div className="grid flex-1 gap-5 sm:gap-6 md:gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {destinations.map(({ path, label, description, accent }) => (
            <Link
              key={path}
              to={path}
              aria-label={`${label} 페이지로 이동`}
              className="group relative block h-full overflow-hidden rounded-3xl bg-slate-900/70 p-6 shadow-lg ring-1 ring-white/5 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-2xl sm:p-7 md:p-8"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100`}
                aria-hidden="true"
              />

              <div className="relative flex h-full flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-200">
                    {label}
                  </span>
                  <p className="text-base text-slate-200 sm:text-lg">
                    {description}
                  </p>
                </div>

                <div className="mt-8 flex items-center text-sm font-semibold text-sky-300 sm:text-base">
                  <span>바로가기</span>
                  <span className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/15 text-sky-200 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1">
                    →
                  </span>
                </div>
              </div>

              <span className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="absolute inset-0 hidden motion-safe:block" aria-hidden="true">
                <span className="absolute -top-16 right-10 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-75" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
