'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLazyQuery } from '@apollo/client';
import {
  Q_MODELS_ID_WITH_SORT,
  Q_MODELS_BRANDID_WITH_SORT,
  Q_MODELS_ID_NO_SORT,
  Q_MODELS_BRANDID_NO_SORT,
} from '@/app/graphql/queries';
import SkeletonCard from '@/app/components/SkeletonCard';
import { useI18n } from '@/app/lib/lang';

type Model = {
  id: string;
  name: string;
  type?: string | null;
  price?: number | null;
  imageUrl?: string | null;
};

const SORT_CANDIDATES = [
  'NAME_ASC', 'NAME_DESC',
  'PRICE_ASC', 'PRICE_DESC',
  // extra guesses, in case API uses different naming:
  'NAME', 'PRICE', 'ASC', 'DESC',
];

export default function BrandModelsPage() {
  const { t } = useI18n();
  const params = useParams<{ id?: string }>();
  const brandId = typeof params?.id === 'string' ? params.id : '';

  const [models, setModels] = useState<Model[] | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [runIdWithSort] = useLazyQuery(Q_MODELS_ID_WITH_SORT, { fetchPolicy: 'no-cache' });
  const [runBrandIdWithSort] = useLazyQuery(Q_MODELS_BRANDID_WITH_SORT, { fetchPolicy: 'no-cache' });
  const [runIdNoSort] = useLazyQuery(Q_MODELS_ID_NO_SORT, { fetchPolicy: 'no-cache' });
  const [runBrandIdNoSort] = useLazyQuery(Q_MODELS_BRANDID_NO_SORT, { fetchPolicy: 'no-cache' });

  const runners = useMemo(() => ([
  
    ...SORT_CANDIDATES.map(sortBy => ({
      name: `id+sort:${sortBy}`,
      fn: () => runIdWithSort({ variables: { id: brandId, sortBy } }),
    })),
    ...SORT_CANDIDATES.map(sortBy => ({
      name: `brandId+sort:${sortBy}`,
      fn: () => runBrandIdWithSort({ variables: { id: brandId, sortBy } }),
    })),
  
    { name: 'id+noSort', fn: () => runIdNoSort({ variables: { id: brandId } }) },
    { name: 'brandId+noSort', fn: () => runBrandIdNoSort({ variables: { id: brandId } }) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ]), [brandId]);

  useEffect(() => {
    let cancelled = false;
    async function fetchModels() {
      if (!brandId) return;
      setLoading(true);
      setModels(null);
      setLastError(null);

      for (const step of runners) {
        try {
          const res = await step.fn();
          const arr: Model[] | undefined = res?.data?.findBrandModels;
          if (Array.isArray(arr)) {
            if (!cancelled) {
              setModels(arr);
              setLoading(false);
            }
            return;
          }
          // if not array, continue
          if (res?.errors?.length) {
            setLastError(`${step.name}: ${res.errors.map(e => e.message).join('; ')}`);
          }
        } catch (e: any) {
          setLastError(`${step.name}: ${e?.message || String(e)}`);
        }
      }

      if (!cancelled) {
        setLoading(false);
        if (!lastError) setLastError('All attempts failed. The API rejected every variant.');
      }
    }
    fetchModels();
    return () => { cancelled = true; };
  }, [brandId, runners]); // re-run when brandId changes

  if (!brandId) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-2">Guitars</h1>
        <p className="text-sm text-neutral-500">{t('error')}: Missing brand id in URL.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-8">
        <Header brandId={brandId} />
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </main>
    );
  }

  if (lastError && !models) {
    return (
      <main className="p-8">
        <Header brandId={brandId} />
        <div className="rounded-xl border border-red-300/50 bg-red-50 dark:bg-red-950/20 p-4 text-red-700 dark:text-red-200">
          <p className="font-semibold">Error: Response not successful.</p>
          <p className="text-sm mt-2">
            {lastError}
          </p>
          <p className="text-sm mt-2">
            If you entered the URL manually, go to the home page and click a brand (IDs might not be 1/2/3).
          </p>
        </div>
      </main>
    );
  }

  const safeModels = models ?? [];

  return (
    <main className="p-8">
      <Header brandId={brandId} />
      {safeModels.length === 0 ? (
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 text-center text-neutral-500">
          {t('no_results') ?? 'No results.'}
        </div>
      ) : (
        <ul className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
          {safeModels.map((m) => (
            <li key={m.id} className="group">
              <Link href={`/models/${m.id}`} className="no-underline">
                <article className="h-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur transition hover:border-black/20 hover:dark:border-white/20">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={m.imageUrl || 'https://placehold.co/800x500?text=Guitar'}
                      alt={m.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold leading-tight">{m.name}</h3>
                      {m.type && (
                        <span className="text-xs px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10">
                          {m.type}
                        </span>
                      )}
                    </div>
                    {typeof m.price === 'number' && (
                      <p className="mt-2 font-semibold">€{m.price}</p>
                    )}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function Header({ brandId }: { brandId: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Guitars</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Brand ID: <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">{brandId}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
