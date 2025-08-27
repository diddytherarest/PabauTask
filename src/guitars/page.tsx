'use client';

import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_MODELS_BY_BRAND } from '@/app/graphql/queries';
import SkeletonCard from '@/app/components/SkeletonCard';
import { useI18n } from '@/app/lib/lang';

type Model = {
  id: string;
  name: string;
  type?: string | null;
  price?: number | null;
  imageUrl?: string | null;
};

const BRAND_ID = '1'; // TODO: replace with a real brand id from your DB
const SORT_BY: 'NAME_ASC' | 'NAME_DESC' | 'PRICE_ASC' | 'PRICE_DESC' = 'NAME_ASC';

export default function GuitarsPage() {
  const { t } = useI18n();

  const { data, loading, error } = useQuery(GET_MODELS_BY_BRAND, {
    variables: { id: BRAND_ID, sortBy: SORT_BY },
  });

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-6">{t('guitars') ?? 'Guitars'}</h1>
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-6">{t('guitars') ?? 'Guitars'}</h1>
        <p className="text-red-600">{t('error') ?? 'Error'}: {error.message}</p>
      </main>
    );
  }

  const models: Model[] = data?.findBrandModels ?? [];

  return (
    <main className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('guitars') ?? 'Guitars'}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {t('showing_brand_models') ?? 'Showing models for selected brand.'}
        </p>
      </div>

      {models.length === 0 ? (
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 text-center text-neutral-500">
          {t('no_results') ?? 'No results.'}
        </div>
      ) : (
        <ul className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
          {models.map((m) => (
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
