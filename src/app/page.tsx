'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import BrandCard from './components/BrandCard';
import { useI18n } from './lib/lang';
import { GET_BRANDS } from './graphql/queries';

type Brand = { id: string; name: string };

export default function HomePage() {
  const { t } = useI18n();
  const { data, loading, error, refetch } = useQuery<{ findAllBrands: Brand[] }>(GET_BRANDS, {
    fetchPolicy: 'no-cache',
  });

  // Quick debug: ensure endpoint is reachable (optional)
  useEffect(() => {
    // console.log('[Home] brands', data?.findAllBrands);
  }, [data]);

  const brands: Brand[] = Array.isArray(data?.findAllBrands) ? data!.findAllBrands : [];

  return (
    <main className="relative p-8">
      {/* Decorative background (no global CSS needed) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* radial ambers */}
        <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_15%_-10%,rgba(250,204,21,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_85%_0%,rgba(250,204,21,0.06),transparent_60%)]" />
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-br from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Guitar Brands
          </span>
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Plug in. Turn up. <span className="text-yellow-300/80">Find your next favorite.</span>
        </p>
      </section>

      {/* Content */}
      {loading ? (
        <ul className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="h-[140px] rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
          ))}
        </ul>
      ) : error ? (
        <div className="rounded-xl border border-red-300/50 bg-red-50/10 p-4 text-red-300">
          {t('error') ?? 'Error'}: {error.message}
          <button
            onClick={() => refetch()}
            className="ml-3 inline-flex rounded-xl border border-white/10 px-3 py-1 text-sm hover:bg-white/5"
          >
            Try again
          </button>
        </div>
      ) : (
        <ul className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {brands.map((b) => (
            <li key={b.id}>
              <Link href={`/brands/${b.id}`} className="no-underline">
                <BrandCard brand={b} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Footer helper */}
      <div className="mt-10 text-xs text-neutral-500">
        Tip: Hover cards — they glow. Tap a brand to browse models.
      </div>
    </main>
  );
}
