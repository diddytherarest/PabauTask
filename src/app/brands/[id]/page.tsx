'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { gql, useApolloClient } from '@apollo/client';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useI18n } from '../../lib/lang';

import ModelCard, { type Model } from '../../components/ModelCard';

const Q_BRAND_BY_ID_ID = gql`
  query BrandModelsById_ID($id: ID!) {
    brand(id: $id) {
      id
      name
         models { id name type price imageUrl year description }
    }
  }
`;

const Q_BRAND_BY_ID_INT = gql`
  query BrandModelsById_INT($id: Int!) {
    brand(id: $id) {
      id
      name
           models { id name type price imageUrl year description }
    }
  }
`;

const Q_FIND_MODELS_BY_BRAND_ID = gql`
  query FindModelsByBrand_ID($id: ID!) {
    findBrandModels(id: $id) {

      id name type price imageUrl year description
    }
  }
`;

const Q_FIND_MODELS_BY_BRAND_BRANDID = gql`
  query FindModelsByBrand_BRANDID($brandId: ID!) {
    findBrandModels(brandId: $brandId) {
  id name type price imageUrl year description
    }
  }
`;

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/** Local helper to normalize any API shape into Model[] */
function coerceModels(arr: any[]): Model[] {
  const out: Model[] = [];
  for (let i = 0; i < arr.length; i++) {
     const raw = arr[i] ?? {};
    const id = String(raw.id ?? raw.modelId ?? i);
    const name = String(raw.name ?? raw.modelName ?? `Model ${i + 1}`);
    const type = raw.type ?? raw.modelType ?? null;

    let price: number | null = null;
    if (typeof raw.price === 'number') price = raw.price;
    else if (typeof raw.price === 'string') {
      const n = Number(raw.price.replace(/[^\d.-]/g, ''));
      price = Number.isFinite(n) ? n : null;
    }

    const imageUrl = raw.imageUrl ?? raw.image ?? raw.photoUrl ?? null;
    const year =
      (typeof raw.year === 'number' ? raw.year : undefined) ??
      (typeof raw.modelYear === 'number' ? raw.modelYear : undefined) ??
      null;
    const description = raw.description ?? raw.summary ?? null;

    out.push({ id, name, type, price, imageUrl, year, description });
  }
  return out;
}

const FALLBACK: Record<string, Model[]> = {
  // 1: Fender
  '1': [
    { id: 'fen-strat', name: 'Stratocaster', type: 'Electric', price: 1299, year: 1954, imageUrl: '/Fender.jpg', description: 'Classic double-cut versatility.' },
    { id: 'fen-tele',  name: 'Telecaster',   type: 'Electric', price: 1199, year: 1951, imageUrl: '/Fender.jpg', description: 'Twangy single-cut icon.' },
    { id: 'fen-jazz',  name: 'Jazzmaster',   type: 'Electric', price: 1399, year: 1958, imageUrl: '/Fender.jpg', description: 'Offset vibes for indie & surf.' },
  ],
  // 2: Ibanez
  '2': [
    { id: 'ibz-rg',   name: 'RG',       type: 'Electric', price: 999, year: 1987, imageUrl: '/Ibanez.jpg', description: 'Fast necks, modern tones.' },
    { id: 'ibz-s',    name: 'S Series', type: 'Electric', price: 899, year: 1987, imageUrl: '/Ibanez.jpg', description: 'Sleek, lightweight shredder.' },
    { id: 'ibz-az',   name: 'AZ',       type: 'Electric', price: 1299, year: 2018, imageUrl: '/Ibanez.jpg', description: 'Versatile boutique-style player.' },
  ],
  // 3: Gibson
  '3': [
    { id: 'gib-lp', name: 'Les Paul', type: 'Electric', price: 2499, year: 1952, imageUrl: '/Gibson.jpg', description: 'Thick, sustaining humbuckers.' },
    { id: 'gib-sg', name: 'SG',       type: 'Electric', price: 1699, year: 1961, imageUrl: '/Gibson.jpg', description: 'Lightweight rock machine.' },
    { id: 'gib-335',name: 'ES-335',   type: 'Semi-Hollow', price: 2899, year: 1958, imageUrl: '/Gibson.jpg', description: 'Iconic semi-hollow warmth.' },
  ],
  // 4: PRS
  '4': [
    { id: 'prs-c24', name: 'Custom 24', type: 'Electric', price: 3599, year: 1985, imageUrl: '/PRS.jpg', description: 'Flagship PRS versatility.' },
    { id: 'prs-se',  name: 'SE Standard', type: 'Electric', price: 799, year: 2001, imageUrl: '/PRS.jpg', description: 'Great value, great feel.' },
  ],
  // 5: Martin
  '5': [
    { id: 'mtn-d28',  name: 'D-28',   type: 'Acoustic', price: 2999, year: 1931, imageUrl: '/Martin.jpg', description: 'Benchmark dreadnought bass & boom.' },
    { id: 'mtn-00015',name: '000-15M',type: 'Acoustic', price: 1499, year: 2009, imageUrl: '/Martin.jpg', description: 'All-mahogany, warm & woody.' },
  ],
  // 6: Yamaha
  '6': [
    { id: 'ymh-pac', name: 'Pacifica', type: 'Electric', price: 399, year: 1990, imageUrl: '/Yamaha.jpg', description: 'Beginner-friendly and versatile.' },
    { id: 'ymh-rv',  name: 'Revstar',  type: 'Electric', price: 699, year: 2015, imageUrl: '/Yamaha.jpg', description: 'Modern single-cut punch.' },
  ],
  // 7: Gretsch
  '7': [
    { id: 'grt-duo', name: 'Duo Jet',     type: 'Electric', price: 1799, year: 1953, imageUrl: '/Gretsch.jpg', description: 'Snappy Filter’Tron bite.' },
    { id: 'grt-falc',name: 'White Falcon',type: 'Hollow',   price: 3499, year: 1954, imageUrl: '/Gretsch.jpg', description: 'Big body, big shimmer.' },
  ],
  // 8: Epiphone
  '8': [
    { id: 'epi-lps', name: 'Les Paul Standard', type: 'Electric', price: 599, year: 1990, imageUrl: '/Epiphone.jpg', description: 'Classic look, friendly price.' },
    { id: 'epi-csn', name: 'Casino',            type: 'Hollow',   price: 699, year: 1961, imageUrl: '/Epiphone.jpg', description: 'Beatles-approved hollow sparkle.' },
  ],
  // 9: Jackson
  '9': [
    { id: 'jck-solo', name: 'Soloist', type: 'Electric', price: 1299, year: 1984, imageUrl: '/Jackson.jpg', description: 'Neck-through shred king.' },
    { id: 'jck-rho',  name: 'Rhoads',  type: 'Electric', price: 1399, year: 1981, imageUrl: '/Jackson.jpg', description: 'Pointy icon with bite.' },
  ],
  // 10: Music Man
  '10': [
    { id: 'mm-sting', name: 'StingRay Guitar', type: 'Electric', price: 2499, year: 2016, imageUrl: '/MusicMan.jpg', description: 'Punchy, modern clarity.' },
    { id: 'mm-axis',  name: 'Axis',            type: 'Electric', price: 2799, year: 1991, imageUrl: '/MusicMan.jpg', description: 'Hot-rodded rock machine.' },
  ],
};

export default function BrandModelsPage() {
  const { t } = useI18n();
  const params = useParams<{ id?: string }>();
  const brandId = typeof params?.id === 'string' ? params.id : '';
  const brandIdNum = Number.isFinite(Number(brandId)) ? Number(brandId) : null;

  const apollo = useApolloClient();

  // UI state
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] =
    useState<'relevance' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('relevance');
  const [typeFilter, setTypeFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Data state
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);

  const tryQuery = async (query: any, vars: Record<string, unknown>, pick: 'brand' | 'find') => {
    try {
      const res = await apollo.query({ query, variables: vars, fetchPolicy: 'no-cache' });
      if (pick === 'brand') {
        const arr = res?.data?.brand?.models ?? [];
        return Array.isArray(arr) ? arr : [];
      }
      const arr = res?.data?.findBrandModels ?? [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!brandId) return;
      setLoading(true);
      setModels([]);

      // 1) Try every known API shape
      let list: any[] = [];

      list = await tryQuery(Q_BRAND_BY_ID_ID, { id: brandId }, 'brand');
      if (!cancelled && list.length) { setModels(coerceModels(list)); setLoading(false); return; }

      if (brandIdNum !== null) {
        list = await tryQuery(Q_BRAND_BY_ID_INT, { id: brandIdNum }, 'brand');
        if (!cancelled && list.length) { setModels(coerceModels(list)); setLoading(false); return; }
      }

      list = await tryQuery(Q_FIND_MODELS_BY_BRAND_ID, { id: brandId }, 'find');
      if (!cancelled && list.length) { setModels(coerceModels(list)); setLoading(false); return; }

      list = await tryQuery(Q_FIND_MODELS_BY_BRAND_BRANDID, { brandId }, 'find');
      if (!cancelled && list.length) { setModels(coerceModels(list)); setLoading(false); return; }
     if (!cancelled) {
        const sample = FALLBACK[brandId] ?? [];
        setModels(sample);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [brandId, brandIdNum, apollo]);

  /** Build type filter options from loaded models */
  const types = useMemo(() => {
    const s = new Set<string>();
    (models ?? []).forEach((m) => m.type && s.add(String(m.type)));
    return ['all', ...Array.from(s)];
  }, [models]);

  /** Apply filters + sorting */
  const displayed = useMemo(() => {
    let arr = models.slice();

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      arr = arr.filter((m) => String(m.name).toLowerCase().includes(needle));
    }
    if (typeFilter !== 'all') {
      arr = arr.filter((m) => (m.type || '').toLowerCase() === typeFilter.toLowerCase());
    }
    if (minPrice.trim() !== '') {
      const n = Number(minPrice);
      if (!Number.isNaN(n)) arr = arr.filter((m) => typeof m.price !== 'number' || m.price >= n);
    }
    if (maxPrice.trim() !== '') {
      const n = Number(maxPrice);
      if (!Number.isNaN(n)) arr = arr.filter((m) => typeof m.price !== 'number' || m.price <= n);
    }
    switch (sortKey) {
      case 'name-asc':  arr.sort((a, b) => String(a.name).localeCompare(String(b.name))); break;
      case 'name-desc': arr.sort((a, b) => String(b.name).localeCompare(String(a.name))); break;
      case 'price-asc': arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)); break;
      case 'price-desc':arr.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity)); break;
      default: break;
    }
    return arr;
  }, [models, q, typeFilter, minPrice, maxPrice, sortKey]);

  return (
    <main className="p-8">
      <div className="mb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-yellow-400">{t('guitars')}</h1>
            <p className="text-sm text-neutral-500 mt-1">
              {t('brand_id')}: <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">{brandId}</code>
            </p>
          </div>
          <Link
            href="/"
            className="text-sm rounded-xl border border-black/10 dark:border-white/10 px-3 py-1.5 bg-white/60 dark:bg-white/5 backdrop-blur hover:border-black/20 hover:dark:border-white/20"
          >
            ← {t('all_brands')}
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <div>
          <label className="block text-xs mb-1 opacity-70">{t('search')}</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`${t('search')} model name…`}
            className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3 outline-none focus:ring-2 ring-black/10 dark:ring-white/10"
          />
        </div>

        <div>
          <label className="block text-xs mb-1 opacity-70">{t('type')}</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3"
          >
            {types.map((tt) => (
              <option key={tt} value={tt}>{tt === 'all' ? t('all_types') : tt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs mb-1 opacity-70">{t('price_range_eur')}</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number" inputMode="numeric" value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder={t('min_eur')}
              className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3"
            />
            <input
              type="number" inputMode="numeric" value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder={t('max_eur')}
              className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-xs mb-1 opacity-70">{t('sort')}</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3"
          >
            <option value="relevance">{t('relevance')}</option>
            <option value="name-asc">{t('name_asc')}</option>
            <option value="name-desc">{t('name_desc')}</option>
            <option value="price-asc">{t('price_asc')}</option>
            <option value="price-desc">{t('price_desc')}</option>
          </select>
        </div>
      </div>

       {loading ? (
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[260px] rounded-2xl border border-black/10 dark:border-white/10 bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 text-center text-neutral-500">
          {t('no_results')}
        </div>
      ) : (
        <motion.ul
          variants={gridVariants}
          initial="hidden"
          animate="show"

           className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]"
        >
          <AnimatePresence initial={false}>
            {displayed.map((m) => (
              <motion.li key={String(m.id)} layout>
                <ModelCard model={m} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </main>
  );
}
