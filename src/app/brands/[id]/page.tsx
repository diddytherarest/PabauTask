'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
const { useQuery } = require('@apollo/client');
import { GET_MODELS_BY_BRAND } from '../../graphql/queries';
import ModelCard from '../../components/ModelCard';
import SkeletonCard from '../../components/SkeletonCard';
import { useI18n } from './../../lib/lang';

type PageProps = { params: { id: string } };
type Model = {
  id: string;
  name: string;
  type?: string | null;
  price?: number | null;
  imageUrl?: string | null;
};

export default function BrandModelsPage({ params }: PageProps) {
  const { id } = params;
  const { t } = useI18n();

  // UI state
  const [rawSearch, setRawSearch] = useState('');
  const [search, setSearch] = useState(''); // debounced
  const [type, setType] = useState('');
  const [visibleCount, setVisibleCount] = useState(12); // initial visible
  const STEP = 8;

  // Debounce search input (250ms)
  useEffect(() => {
    const h = setTimeout(() => setSearch(rawSearch), 250);
    return () => clearTimeout(h);
  }, [rawSearch]);

  // Fetch models for this brand
  const { data, loading, error } = useQuery(GET_MODELS_BY_BRAND, {
    variables: { brandId: id },
  });

  // --- SKELETON LOADER ---
  if (loading) {
    return (
      <main className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('models_for_brand')}: {id}</h1>
          <Link href="/" className="underline">← {t('back')}</Link>
        </div>

        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    );
  }
  // --- END SKELETON ---

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-600 mb-4">{t('error')}: {error.message}</p>
        <Link href="/" className="underline">← {t('back')}</Link>
      </main>
    );
  }

  const models: Model[] = data?.models ?? [];

  // Client-side search + type filter
  const filtered = useMemo(() => {
    let out = models;
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(m => m.name.toLowerCase().includes(q));
    }
    if (type) out = out.filter(m => (m.type || '').toLowerCase() === type.toLowerCase());
    return out;
  }, [models, search, type]);

  // Reset visible when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [search, type]);

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setVisibleCount(n => Math.min(n + STEP, filtered.length));
        }
      },
      { rootMargin: '800px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const pageItems = filtered.slice(0, visibleCount);

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('models_for_brand')}: {id}</h1>
        <Link href="/" className="underline">← {t('back')}</Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={rawSearch}
          onChange={(e) => setRawSearch(e.target.value)}
          placeholder={t('search_models')}
          className="border rounded px-3 py-2 w-full sm:w-64"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-48"
        >
          <option value="">{t('all_types')}</option>
          <option value="Acoustic">{t('acoustic')}</option>
          <option value="Electric">{t('electric')}</option>
          <option value="Bass">{t('bass')}</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 && <p>{t('no_models')}</p>}
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {pageItems.map((m) => (
          <Link key={m.id} href={`/guitars/${m.id}`} className="no-underline">
            <ModelCard model={m} />
          </Link>
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      {visibleCount < filtered.length && (
        <div
          ref={sentinelRef}
          className="h-10 flex items-center justify-center text-sm text-zinc-500 mt-6"
        >
          loading more…
        </div>
      )}
    </main>
  );
}
