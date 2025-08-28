/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../lib/lang';
import { GET_GUITAR_DETAILS } from '../../graphql/queries';

type Specs = {
  type?: string | null;
  body?: string | null;
  neck?: string | null;
  // Accept BOTH shapes the API might use:
  scaleLength?: string | null;
  scale_length?: string | null;
  pickups?: string | null;
  strings?: string | null;
};

type Brand = { id: string; name: string };

type Musician = {
  id: string;
  name: string;
  instrument?: string | null;
  note?: string | null;
  photoUrl?: string | null;
};

type ModelDetails = {
  id: string;
  name: string;
  price?: number | null;
  year?: number | null;
  imageUrl?: string | null;
  brand?: Brand | null;
  specs?: Specs | null;
  musicians?: Musician[] | null;
};

type QueryShape = { findUniqueModel: ModelDetails | null };

const sectionVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function GuitarDetailsPage() {
  const { t } = useI18n();
  const params = useParams<{ id?: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { data, loading, error, refetch } = useQuery<QueryShape>(GET_GUITAR_DETAILS, {
    variables: { id },
    fetchPolicy: 'no-cache',
    skip: !id,
  });

  const model = data?.findUniqueModel ?? null;

  // Tabs
  const [tab, setTab] = useState<'specs' | 'musicians'>('specs');

  // Musicians pagination: 2 at a time
  const musicians = model?.musicians ?? [];
  const pageSize = 2;
  const pages = Math.max(1, Math.ceil((musicians?.length ?? 0) / pageSize));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [tab, musicians?.length]);

  const visibleMusicians = useMemo(() => {
    const start = page * pageSize;
    return (musicians || []).slice(start, start + pageSize);
  }, [page, musicians]);

  const brandHref = model?.brand?.id ? `/brands/${model.brand.id}` : '/';

  // Helper to prefer snake_case if present, then camelCase
  const scaleVal =
    model?.specs?.scale_length ?? model?.specs?.scaleLength ?? null;

  return (
    <main className="relative p-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(650px_circle_at_15%_-10%,rgba(250,204,21,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(550px_circle_at_85%_0%,rgba(250,204,21,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Header / Back */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-br from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              {model?.name || t('guitar')}
            </span>
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            {model?.brand?.name ? `${t('by')} ${model.brand.name}` : ''}
          </p>
        </div>
        <Link
          href={brandHref}
          className="text-sm rounded-xl border border-black/10 dark:border-white/10 px-3 py-1.5 bg-white/60 dark:bg-white/5 backdrop-blur hover:border-black/20 hover:dark:border-white/20"
        >
          ← {t('back_to_models')}
        </Link>
      </div>

      {/* Card */}
      <section className="mb-6 grid gap-6 lg:grid-cols-[320px,1fr]">
        {/* Image */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          className="relative aspect-[4/3] w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
        >
          {model?.imageUrl ? (
            <Image
              src={model.imageUrl}
              alt={model?.name || 'Guitar'}
              fill
              sizes="(min-width: 1024px) 320px, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-neutral-500">—</div>
          )}
        </motion.div>

        {/* Meta + Tabs */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5"
        >
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="opacity-60">{t('type')}</dt>
              <dd className="font-semibold">{model?.specs?.type ?? '—'}</dd>
            </div>
            <div>
              <dt className="opacity-60">{t('year')}</dt>
              <dd className="font-semibold">{model?.year ?? '—'}</dd>
            </div>
            <div>
              <dt className="opacity-60">{t('price')}</dt>
              <dd className="font-semibold">
                {typeof model?.price === 'number' ? `€${model.price}` : '—'}
              </dd>
            </div>
          </dl>

          {/* Tabs */}
          <div className="mt-6">
            <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setTab('specs')}
                className={`px-4 py-1.5 rounded-lg text-sm transition ${
                  tab === 'specs'
                    ? 'bg-yellow-400/20 text-yellow-200'
                    : 'hover:bg-white/5 text-neutral-300'
                }`}
              >
                {t('specs')}
              </button>
              <button
                onClick={() => setTab('musicians')}
                className={`px-4 py-1.5 rounded-lg text-sm transition ${
                  tab === 'musicians'
                    ? 'bg-yellow-400/20 text-yellow-200'
                    : 'hover:bg-white/5 text-neutral-300'
                }`}
              >
                {t('musicians')}
              </button>
            </div>

            {/* Tab panels */}
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {tab === 'specs' ? (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm"
                  >
                    <SpecRow label={t('body')} value={model?.specs?.body} />
                    <SpecRow label={t('neck')} value={model?.specs?.neck} />
                    <SpecRow label={t('scale_length')} value={scaleVal} />
                    <SpecRow label={t('pickups')} value={model?.specs?.pickups} />
                    <SpecRow label={t('strings')} value={model?.specs?.strings} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="musicians"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    {musicians?.length ? (
                      <>
                        <ul className="grid sm:grid-cols-2 gap-4">
                          {visibleMusicians.map((m) => (
                            <li key={m.id}>
                              <MusicianCard m={m} />
                            </li>
                          ))}
                        </ul>

                        {/* Pager: dots + "show 2 more" */}
                        {pages > 1 && (
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {Array.from({ length: pages }).map((_, i) => (
                                <button
                                  key={i}
                                  aria-label={`page ${i + 1}`}
                                  onClick={() => setPage(i)}
                                  className={`h-2.5 w-2.5 rounded-full transition ${
                                    i === page ? 'bg-yellow-300' : 'bg-white/20 hover:bg-white/40'
                                  }`}
                                />
                              ))}
                            </div>

                            {page < pages - 1 ? (
                              <button
                                onClick={() => setPage((p) => Math.min(p + 1, pages - 1))}
                                className="text-xs rounded-lg border border-white/10 px-3 py-1 hover:bg-white/5"
                              >
                                {t('show_two_more')}
                              </button>
                            ) : (
                              <button
                                onClick={() => setPage(0)}
                                className="text-xs rounded-lg border border-white/10 px-3 py-1 hover:bg-white/5"
                              >
                                {t('back_to_start')}
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-neutral-400">{t('no_musicians')}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* States */}
      {loading && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-neutral-400">
          {t('loading')}…
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-300/50 bg-red-50/10 p-4 text-red-300">
          {t('error')}: {error.message}{' '}
          <button
            onClick={() => refetch()}
            className="ml-2 inline-flex rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
          >
            {t('try_again')}
          </button>
        </div>
      )}
    </main>
  );
}

/* ───── helpers ───── */

function SpecRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid sm:grid-cols-[160px,1fr] items-baseline gap-2 py-2 border-b border-white/5 last:border-0">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-sm font-medium">{value ?? '—'}</div>
    </div>
  );
}

function MusicianCard({ m }: { m: Musician }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-white/5 p-3 flex items-center gap-3">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-yellow-400/70 bg-black/40">
        {m.photoUrl ? (
          <Image src={m.photoUrl} alt={m.name} fill sizes="48px" className="object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-xs opacity-60">—</div>
        )}
      </div>
      <div className="min-w-0">
        <div className="font-semibold leading-tight">{m.name}</div>
        <div className="text-xs text-neutral-400">
          {m.instrument || ''}{m.instrument && m.note ? ' • ' : ''}{m.note || ''}
        </div>
      </div>
    </div>
  );
}
