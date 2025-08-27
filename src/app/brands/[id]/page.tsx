'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { gql, useLazyQuery } from '@apollo/client';
import {
  // root array variants
  Q_MODELS_ID_WITH_SORT,
  Q_MODELS_BRANDID_WITH_SORT,
  Q_MODELS_ID_NO_SORT,
  Q_MODELS_BRANDID_NO_SORT,
  Q_MODELS_BY_BRAND_ID,
  Q_MODELS_BY_BRAND_INT,
  Q_FIND_MODELS_BY_BRAND_ID,
  Q_FIND_MODELS_BY_BRAND_INT,
  // nested brand → models variants
  Q_BRAND_ID_MODELS,
  Q_BRAND_INT_MODELS,
  Q_BRAND_BY_ID_ID_MODELS,
  Q_BRAND_BY_ID_INT_MODELS,
  Q_FIND_UNIQUE_BRAND_ID_MODELS,
  Q_FIND_UNIQUE_BRAND_INT_MODELS,
  Q_FIND_BRAND_BY_ID_ID_MODELS,
  Q_FIND_BRAND_BY_ID_INT_MODELS,
  Q_BRAND_ID_GUITAR_MODELS,
  Q_BRAND_ID_BRAND_MODELS,
} from '../../graphql/queries';
import { useI18n } from '../../lib/lang';
import SkeletonCard from '@/app/components/SkeletonCard';
import ModelCard, { Model as ModelType } from '@/app/components/ModelCard';
import Link from 'next/link';

type Model = ModelType & {
  // tolerate any extra fields your API might add
  [k: string]: any;
};

/** Fallback GraphQL document so Apollo never receives `undefined`. */
const DUMMY_DOC = gql`query __D { __typename }`;

const SORT_CANDIDATES = ['NAME_ASC', 'NAME_DESC', 'PRICE_ASC', 'PRICE_DESC', 'NAME', 'PRICE', 'ASC', 'DESC'];

/** Recursively find the first array of objects that looks like a "model list". */
function findModelArray(node: any): Model[] | undefined {
  if (!node) return undefined;
  if (Array.isArray(node) && node.length && typeof node[0] === 'object') {
    if ('id' in node[0] && 'name' in node[0]) return node as Model[];
  }
  if (typeof node === 'object') {
    for (const key of Object.keys(node)) {
      const res = findModelArray((node as any)[key]);
      if (res) return res;
    }
  }
  return undefined;
}

export default function BrandModelsPage() {
  const { t } = useI18n();
  const params = useParams<{ id?: string }>();
  const brandIdRaw = typeof params?.id === 'string' ? params.id : '';
  const brandIdNum = Number.isFinite(Number(brandIdRaw)) ? Number(brandIdRaw) : NaN;

  const [models, setModels] = useState<Model[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // UI state
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<'relevance' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>(
    'relevance'
  );
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const docs = {
    // root array docs
    idWithSort: Q_MODELS_ID_WITH_SORT ?? DUMMY_DOC,
    brandIdWithSort: Q_MODELS_BRANDID_WITH_SORT ?? DUMMY_DOC,
    idNoSort: Q_MODELS_ID_NO_SORT ?? DUMMY_DOC,
    brandIdNoSort: Q_MODELS_BRANDID_NO_SORT ?? DUMMY_DOC,
    byBrandId: Q_MODELS_BY_BRAND_ID ?? DUMMY_DOC,
    byBrandInt: Q_MODELS_BY_BRAND_INT ?? DUMMY_DOC,
    findByBrandId: Q_FIND_MODELS_BY_BRAND_ID ?? DUMMY_DOC,
    findByBrandInt: Q_FIND_MODELS_BY_BRAND_INT ?? DUMMY_DOC,
    // nested brand docs
    brand_id_models: Q_BRAND_ID_MODELS ?? DUMMY_DOC,
    brand_int_models: Q_BRAND_INT_MODELS ?? DUMMY_DOC,
    brandById_id_models: Q_BRAND_BY_ID_ID_MODELS ?? DUMMY_DOC,
    brandById_int_models: Q_BRAND_BY_ID_INT_MODELS ?? DUMMY_DOC,
    uniqueBrand_id_models: Q_FIND_UNIQUE_BRAND_ID_MODELS ?? DUMMY_DOC,
    uniqueBrand_int_models: Q_FIND_UNIQUE_BRAND_INT_MODELS ?? DUMMY_DOC,
    findBrandById_id_models: Q_FIND_BRAND_BY_ID_ID_MODELS ?? DUMMY_DOC,
    findBrandById_int_models: Q_FIND_BRAND_BY_ID_INT_MODELS ?? DUMMY_DOC,
    brand_id_guitarModels: Q_BRAND_ID_GUITAR_MODELS ?? DUMMY_DOC,
    brand_id_brandModels: Q_BRAND_ID_BRAND_MODELS ?? DUMMY_DOC,
  };

  // bind lazy queries
  const [runIdWithSort]      = useLazyQuery(docs.idWithSort,      { fetchPolicy: 'no-cache' });
  const [runBrandIdWithSort] = useLazyQuery(docs.brandIdWithSort, { fetchPolicy: 'no-cache' });
  const [runIdNoSort]        = useLazyQuery(docs.idNoSort,        { fetchPolicy: 'no-cache' });
  const [runBrandIdNoSort]   = useLazyQuery(docs.brandIdNoSort,   { fetchPolicy: 'no-cache' });
  const [runByBrandId]       = useLazyQuery(docs.byBrandId,       { fetchPolicy: 'no-cache' });
  const [runByBrandInt]      = useLazyQuery(docs.byBrandInt,      { fetchPolicy: 'no-cache' });
  const [runFindByBrandId]   = useLazyQuery(docs.findByBrandId,   { fetchPolicy: 'no-cache' });
  const [runFindByBrandInt]  = useLazyQuery(docs.findByBrandInt,  { fetchPolicy: 'no-cache' });

  const [runBrand_id_models]          = useLazyQuery(docs.brand_id_models,          { fetchPolicy: 'no-cache' });
  const [runBrand_int_models]         = useLazyQuery(docs.brand_int_models,         { fetchPolicy: 'no-cache' });
  const [runBrandById_id_models]      = useLazyQuery(docs.brandById_id_models,      { fetchPolicy: 'no-cache' });
  const [runBrandById_int_models]     = useLazyQuery(docs.brandById_int_models,     { fetchPolicy: 'no-cache' });
  const [runUniqueBrand_id_models]    = useLazyQuery(docs.uniqueBrand_id_models,    { fetchPolicy: 'no-cache' });
  const [runUniqueBrand_int_models]   = useLazyQuery(docs.uniqueBrand_int_models,   { fetchPolicy: 'no-cache' });
  const [runFindBrandById_id_models]  = useLazyQuery(docs.findBrandById_id_models,  { fetchPolicy: 'no-cache' });
  const [runFindBrandById_int_models] = useLazyQuery(docs.findBrandById_int_models, { fetchPolicy: 'no-cache' });
  const [runBrand_id_guitarModels]    = useLazyQuery(docs.brand_id_guitarModels,    { fetchPolicy: 'no-cache' });
  const [runBrand_id_brandModels]     = useLazyQuery(docs.brand_id_brandModels,     { fetchPolicy: 'no-cache' });

  const runners = useMemo(() => {
    const steps: { name: string; fn: () => Promise<any> }[] = [];

    // 1) findBrandModels(id/brandId) with/without sort (id as string)
    for (const sortBy of SORT_CANDIDATES) {
      steps.push({ name: `findBrandModels(id:"${brandIdRaw}", sort:${sortBy})`, fn: () => runIdWithSort({ variables: { id: brandIdRaw, sortBy } }) });
      steps.push({ name: `findBrandModels(brandId:"${brandIdRaw}", sort:${sortBy})`, fn: () => runBrandIdWithSort({ variables: { id: brandIdRaw, sortBy } }) });
    }
    steps.push({ name: `findBrandModels(id:"${brandIdRaw}")`, fn: () => runIdNoSort({ variables: { id: brandIdRaw } }) });
    steps.push({ name: `findBrandModels(brandId:"${brandIdRaw}")`, fn: () => runBrandIdNoSort({ variables: { id: brandIdRaw } }) });

    // 2) modelsByBrand / findModelsByBrand (string & int)
    steps.push({ name: `modelsByBrand(brandId:"${brandIdRaw}")`, fn: () => runByBrandId({ variables: { brandId: brandIdRaw } }) });
    steps.push({ name: `findModelsByBrand(brandId:"${brandIdRaw}")`, fn: () => runFindByBrandId({ variables: { brandId: brandIdRaw } }) });
    if (!Number.isNaN(brandIdNum)) {
      steps.push({ name: `modelsByBrand(brandId:${brandIdNum})`, fn: () => runByBrandInt({ variables: { brandId: brandIdNum } }) });
      steps.push({ name: `findModelsByBrand(brandId:${brandIdNum})`, fn: () => runFindByBrandInt({ variables: { brandId: brandIdNum } }) });
    }

    // 3) brand-like nodes with nested models/guitarModels/brandModels (string & int)
    steps.push({ name: `brand(id:"${brandIdRaw}") { models }`, fn: () => runBrand_id_models({ variables: { id: brandIdRaw } }) });
    steps.push({ name: `brand(id:"${brandIdRaw}") { guitarModels }`, fn: () => runBrand_id_guitarModels({ variables: { id: brandIdRaw } }) });
    steps.push({ name: `brand(id:"${brandIdRaw}") { brandModels }`, fn: () => runBrand_id_brandModels({ variables: { id: brandIdRaw } }) });
    steps.push({ name: `brandById(id:"${brandIdRaw}") { models }`, fn: () => runBrandById_id_models({ variables: { id: brandIdRaw } }) });
    steps.push({ name: `findUniqueBrand(id:"${brandIdRaw}") { models }`, fn: () => runUniqueBrand_id_models({ variables: { id: brandIdRaw } }) });
    steps.push({ name: `findBrandById(id:"${brandIdRaw}") { models }`, fn: () => runFindBrandById_id_models({ variables: { id: brandIdRaw } }) });

    if (!Number.isNaN(brandIdNum)) {
      steps.push({ name: `brand(id:${brandIdNum}) { models }`, fn: () => runBrand_int_models({ variables: { id: brandIdNum } }) });
      steps.push({ name: `brandById(id:${brandIdNum}) { models }`, fn: () => runBrandById_int_models({ variables: { id: brandIdNum } }) });
      steps.push({ name: `findUniqueBrand(id:${brandIdNum}) { models }`, fn: () => runUniqueBrand_int_models({ variables: { id: brandIdNum } }) });
      steps.push({ name: `findBrandById(id:${brandIdNum}) { models }`, fn: () => runFindBrandById_int_models({ variables: { id: brandIdNum } }) });
    }

    return steps;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandIdRaw, brandIdNum]);

  useEffect(() => {
    let cancelled = false;

    async function fetchModels() {
      if (!brandIdRaw) return;

      setLoading(true);
      setModels(null);
      setErrorText(null);

      const collectedErrors: string[] = [];

      for (const step of runners) {
        try {
          const res = await step.fn();
          if (res?.errors?.length) {
            collectedErrors.push(`${step.name}: ${res.errors.map((e: any) => e.message).join(' | ')}`);
          }
          const arr = findModelArray(res?.data);
          if (Array.isArray(arr)) {
            if (!cancelled) {
              setModels(arr);
              setLoading(false);
            }
            return;
          }
        } catch (e: any) {
          collectedErrors.push(`${step.name}: ${e?.message || String(e)}`);
        }
      }

      if (!cancelled) {
        setLoading(false);
        setErrorText(collectedErrors.join('\n'));
      }
    }

    fetchModels();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandIdRaw, runners]);

  // Distinct types for filter dropdown
  const types = useMemo(() => {
    const set = new Set<string>();
    (models ?? []).forEach((m) => { if (m.type) set.add(m.type); });
    return ['all', ...Array.from(set)];
  }, [models]);

  // Derived filtered/sorted list
  const displayed: Model[] = useMemo(() => {
    let arr = (models ?? []).slice();

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      arr = arr.filter((m) => m.name.toLowerCase().includes(needle));
    }
    if (typeFilter !== 'all') {
      arr = arr.filter((m) => (m.type || '').toLowerCase() === typeFilter.toLowerCase());
    }
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!Number.isNaN(min)) arr = arr.filter((m) => typeof m.price !== 'number' || (m.price as number) >= min);
    if (!Number.isNaN(max)) arr = arr.filter((m) => typeof m.price !== 'number' || (m.price as number) <= max);

    switch (sortKey) {
      case 'name-asc':
        arr.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc':
        arr.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc':
        arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)); break;
      case 'price-desc':
        arr.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity)); break;
      default:
        // relevance: leave as-is (server order)
        break;
    }

    return arr;
  }, [models, q, typeFilter, minPrice, maxPrice, sortKey]);

  if (!brandIdRaw) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-2">Guitars</h1>
        <p className="text-sm text-neutral-500">{t('error')}: Missing brand id in URL.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <Header brandId={brandIdRaw} />

      {/* Controls */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search model name…"
          className="h-10 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3 outline-none focus:ring-2 ring-black/10 dark:ring-white/10"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All types' : t}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min €"
            className="h-10 flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3"
          />
          <input
            type="number"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max €"
            className="h-10 flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3"
          />
        </div>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as any)}
          className="h-10 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3"
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="name-asc">Sort: Name ↑</option>
          <option value="name-desc">Sort: Name ↓</option>
          <option value="price-asc">Sort: Price ↑</option>
          <option value="price-desc">Sort: Price ↓</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Errors */}
      {errorText && !loading && !models && (
        <div className="rounded-xl border border-red-300/50 bg-red-50/70 dark:bg-red-950/20 p-4 text-red-700 dark:text-red-200">
          <p className="font-semibold">Error: Response not successful.</p>
          <pre className="mt-2 whitespace-pre-wrap text-xs opacity-90">{errorText}</pre>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <>
          {displayed.length === 0 ? (
            <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 text-center text-neutral-500">
              {t('no_results') ?? 'No results.'}
            </div>
          ) : (
            <ul className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
              {displayed.map((m) => (
                <li key={String(m.id)}>
                  <ModelCard model={m} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}

function Header({ brandId }: { brandId: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">Guitars</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Brand ID:{' '}
            <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">{brandId}</code>
          </p>
        </div>
        <Link
          href="/"
          className="text-sm rounded-xl border border-black/10 dark:border-white/10 px-3 py-1.5 bg-white/60 dark:bg-white/5 backdrop-blur hover:border-black/20 hover:dark:border-white/20"
        >
          ← All brands
        </Link>
      </div>
    </div>
  );
}
