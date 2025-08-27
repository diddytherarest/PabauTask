'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_GUITAR_DETAILS } from '../../graphql/queries'; // relative to app/models/[id]
import { useI18n } from '../../lib/lang';

type Musician = {
  id: string | number;
  name: string;
  photoUrl?: string | null;
  instrument?: string | null;
  note?: string | null;
};

type Specs = {
  type?: string | null;
  body?: string | null;
  neck?: string | null;
  scaleLength?: string | null;
  pickups?: string | null;
  strings?: string | null;
};

type Brand = { id: string | number; name: string };

type Model = {
  id: string | number;
  name: string;
  price?: number | null;
  year?: number | null;
  imageUrl?: string | null;
  brand?: Brand | null;
  specs?: Specs | null;
  musicians?: Musician[] | null;
};

function formatPrice(p?: number | null) {
  if (typeof p !== 'number') return 'Price on request';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(p);
  } catch {
    return `€${p}`;
  }
}

export default function ModelDetailsPage() {
  const { t } = useI18n();
  const params = useParams<{ id?: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { data, loading, error, refetch } = useQuery<{ findUniqueModel: Model }>(GET_GUITAR_DETAILS, {
    variables: { id },
    fetchPolicy: 'no-cache',
    skip: !id,
  });

  if (!id) {
    return (
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-neutral-500">{t('error')}: Missing model id in URL.</p>
          <Link href="/" className="inline-block mt-3 underline">← Back to brands</Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="aspect-[16/8] w-full rounded-2xl bg-black/5 dark:bg-white/10 mb-6" />
          <div className="h-8 w-1/2 rounded bg-black/5 dark:bg-white/10 mb-3" />
          <div className="h-4 w-2/3 rounded bg-black/5 dark:bg-white/10 mb-8" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-40 rounded-xl bg-black/5 dark:bg-white/10" />
            <div className="h-40 rounded-xl bg-black/5 dark:bg-white/10" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl border border-red-300/50 bg-red-50 dark:bg-red-950/20 p-4 text-red-700 dark:text-red-200">
            <p className="font-semibold">Error loading model</p>
            <p className="text-sm mt-2">{error.message}</p>
            <button onClick={() => refetch()} className="mt-3 inline-flex items-center rounded-md border px-3 py-1 text-sm">
              Retry
            </button>
          </div>
          <Link href="/" className="inline-block mt-4 underline">← Back to brands</Link>
        </div>
      </main>
    );
  }

  const m = data?.findUniqueModel;
  if (!m) {
    return (
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-neutral-500">{t('no_results') ?? 'No results.'}</p>
          <Link href="/" className="inline-block mt-3 underline">← Back to brands</Link>
        </div>
      </main>
    );
  }

  const spec = m.specs ?? {};
  const priceText = formatPrice(m.price);

  return (
    <main className="p-0 sm:p-8">
      <article className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="aspect-[16/6] w-full bg-black/5 dark:bg-white/10">
            <img
              src={m.imageUrl || 'https://placehold.co/1600x600?text=Guitar'}
              alt={m.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Title card overlays the hero */}
          <div className="px-4 sm:px-0">
            <div className="relative -mt-10 sm:-mt-12 max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-5 mx-4 sm:mx-0">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold leading-tight">{m.name}</h1>
                  <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    {m.brand ? (
                      <>
                        <span>by</span>
                        <Link className="underline" href={`/brands/${String(m.brand.id)}`} prefetch={false}>
                          {m.brand.name}
                        </Link>
                      </>
                    ) : null}
                    {typeof m.year === 'number' ? (
                      <>
                        <span>•</span>
                        <span>{m.year}</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{priceText}</div>
                  {spec.type ? <div className="text-xs text-neutral-500">{spec.type}</div> : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="px-4 sm:px-0 mt-8 grid gap-8 lg:grid-cols-3">
          {/* Specs */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-3">Specifications</h2>
            <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
              <table className="w-full text-sm">
                <tbody className="[&_tr:nth-child(odd)]:bg-black/5 dark:[&_tr:nth-child(odd)]:bg-white/5">
                  {[
                    ['Type', spec.type],
                    ['Body', spec.body],
                    ['Neck', spec.neck],
                    ['Scale length', spec.scaleLength],
                    ['Pickups', spec.pickups],
                    ['Strings', spec.strings],
                  ]
                    .filter(([, v]) => v && String(v).trim().length > 0)
                    .map(([k, v]) => (
                      <tr key={k}>
                        <th className="text-left font-medium px-4 py-3 w-40">{k}</th>
                        <td className="px-4 py-3">{String(v)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sidebar / CTA */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
              <h3 className="font-semibold mb-2">Interested?</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Contact us for availability, setup options, and bundle discounts.
              </p>
              <a href="#" className="mt-3 inline-flex items-center justify-center rounded-xl border border-black/10 dark:border-white/10 px-4 py-2 hover:border-black/20 hover:dark:border-white/20">
                Get a quote
              </a>
              <div className="mt-3 text-xs text-neutral-500">Model ID: {String(m.id)}</div>
            </div>
          </aside>
        </div>

        {/* Musicians */}
        {m.musicians && m.musicians.length > 0 && (
          <section className="mt-10 px-4 sm:px-0">
            <h2 className="text-lg font-semibold mb-3">Famous players</h2>
            <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
              {m.musicians.map((p) => (
                <li key={String(p.id)}>
                  <article className="h-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur">
                    <div className="aspect-[4/3] bg-black/5 dark:bg-white/10 overflow-hidden">
                      <img
                        src={p.photoUrl || 'https://placehold.co/800x600?text=Artist'}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold leading-tight">{p.name}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        {[p.instrument, p.note].filter(Boolean).join(' • ') || 'Guitarist'}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Back link */}
        <div className="mt-10 px-4 sm:px-0">
          <Link
            href={m.brand ? `/brands/${String(m.brand.id)}` : '/'}
            className="inline-flex items-center rounded-xl border border-black/10 dark:border-white/10 px-3 py-1.5 bg-white/60 dark:bg-white/5 backdrop-blur hover:border-black/20 hover:dark:border-white/20"
          >
            ← Back to {m.brand?.name || 'all brands'}
          </Link>
        </div>
      </article>
    </main>
  );
}
