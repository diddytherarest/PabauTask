'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import { useI18n } from './lib/lang';
import BrandCard from './components/BrandCard';

const GET_BRANDS = gql`
  query GetBrands {
    findAllBrands {
      id
      name
    }
  }
`;

export default function HomePage() {
  const { t } = useI18n();
  const { data, loading, error, refetch } = useQuery(GET_BRANDS, {
    fetchPolicy: 'no-cache',
  });

  // Dev: log endpoint and result for quick debugging
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[Home] env NEXT_PUBLIC_GRAPHQL_ENDPOINT =', process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);
    // eslint-disable-next-line no-console
    console.log('[Home] query status', { loading, error, data });
  }, [loading, error, data]);

  return (
    <main className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{t('guitar_brands') ?? 'Guitar Brands'}</h1>
      </header>

      {loading && <p className="text-sm text-neutral-500">{t('loading') ?? 'Loading…'}</p>}

      {error && (
        <div className="mb-6 rounded-xl border border-red-300/50 bg-red-50 dark:bg-red-950/20 p-4">
          <p className="text-red-700 dark:text-red-200 font-semibold">Error: {error.message}</p>
          <p className="text-sm mt-2 text-red-700 dark:text-red-200">Most common reasons:</p>
          <ul className="text-sm mt-1 list-disc ml-5 text-red-700 dark:text-red-200">
            <li>GraphQL server not running / wrong URL</li>
            <li>CORS not allowing <code>http://localhost:3000</code></li>
            <li>HTTPS certificate not trusted (if using <code>https://localhost</code>)</li>
          </ul>
          <button
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center rounded-md border px-3 py-1 text-sm"
          >
            Retry
          </button>
          <div className="mt-3 text-xs opacity-70">
            Endpoint:{' '}
            <code>{process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8080/graphql'}</code>
          </div>
        </div>
      )}

      {data?.findAllBrands?.length ? (
        <ul className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {data.findAllBrands.map((b: { id: string; name: string }) => (
            <li key={b.id}>
              <Link href={`/brands/${b.id}`} className="no-underline">
                <BrandCard brand={b} />
              </Link>
            </li>
          ))}
        </ul>
      ) : !loading && !error ? (
        <p className="text-neutral-500">{t('no_results') ?? 'No brands found.'}</p>
      ) : null}
    </main>
  );
}
