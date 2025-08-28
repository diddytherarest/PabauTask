'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

/**
 * If you already have a richer details page (tabs, specs, musicians, etc.),
 * keep all of that below. The important bit is computing `backHref` from
 * the `brand` query param so the back button returns to the models grid.
 */

export default function ModelDetailsPage() {
  const params = useParams<{ id?: string }>();
  const modelId = params?.id ?? '';

  const search = useSearchParams();
  const fromBrand = search.get('brand');

  // Where to go when clicking "Back to models"
  const backHref = useMemo(
    () => (fromBrand ? `/brands/${encodeURIComponent(fromBrand)}` : '/'),
    [fromBrand]
  );

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400">Guitar</h1>

        <Link
          href={backHref}
          className="text-sm rounded-xl border border-black/10 dark:border-white/10 px-3 py-1.5 bg-white/60 dark:bg-white/5 backdrop-blur hover:border-black/20 hover:dark:border-white/20"
        >
          ← Back to models
        </Link>
      </div>

      {/* ----------------------------------------------------------------
         Your existing details content goes below. Keep your current layout,
         tabs, queries, etc. If you don’t have content yet, the blocks
         below are only gentle placeholders to keep layout consistent.
      ------------------------------------------------------------------ */}
      <section className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/5 h-[320px]" />
        <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6">
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-neutral-400">Type</div>
              <div className="mt-1">—</div>
            </div>
            <div>
              <div className="text-neutral-400">Year</div>
              <div className="mt-1">—</div>
            </div>
            <div>
              <div className="text-neutral-400">Price</div>
              <div className="mt-1">—</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
              Model ID: <span className="ml-1 font-mono text-yellow-200">{String(modelId)}</span>
            </div>
          </div>

          {/* Tabs placeholder */}
          <div className="mt-8">
            <div className="mb-3 flex gap-2">
              <button className="rounded-full bg-yellow-500/20 text-yellow-200 px-3 py-1 text-xs">
                Specs
              </button>
              <button className="rounded-full border border-white/10 px-3 py-1 text-xs">
                Musicians
              </button>
            </div>

            <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 min-h-[220px]">
              {/* Put your real specs/musicians content here */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
