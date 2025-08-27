'use client';

import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_BRANDS } from './graphql/queries';
import BrandCard from './components/BrandCard';
import SkeletonCard from './components/SkeletonCard';
import { useI18n } from './lib/lang';

type Brand = { id: string; name: string; logoUrl?: string | null };

export default function HomePage() {
  const { t } = useI18n();
  const { data, loading, error } = useQuery(GET_BRANDS);

  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-6">{t('guitar_brands')}</h1>
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
      <main className="p-8 text-red-600">
        {t('error')}: {error.message}
      </main>
    );
  }

const brands: Brand[] = data?.findAllBrands ?? [];


  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t('guitar_brands')}</h1>
      {brands.length === 0 && <p>{t('no_brands')}</p>}

      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {brands.map((b) => (
          <Link key={b.id} href={`/brands/${b.id}`} className="no-underline">
            <BrandCard brand={b} />
          </Link>
        ))}
      </div>
    </main>
  );
}
