// src/app/components/ModelCard.tsx
'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';

export type Model = {
  id: string;
  name: string;
  type?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  year?: number | null;
  description?: string | null;
};

export type ModelCardProps = {
  model: Model;
  /** Optional controlled selection flag */
  selected?: boolean;
  /** Optional controlled selection change */
  onSelectChange?: (checked: boolean) => void;
};

function formatPriceEUR(v?: number | null) {
  if (typeof v !== 'number' || !Number.isFinite(v)) return '—';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `${Math.round(v)} €`;
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ModelCard(props: ModelCardProps) {
  const { model, selected, onSelectChange } = props;

  // Uncontrolled fallback for selection
  const [internalSelected, setInternalSelected] = useState(false);
  const isSelected = selected ?? internalSelected;

  const toggle = () => {
    const next = !isSelected;
    if (onSelectChange) onSelectChange(next);
    else setInternalSelected(next);
  };

  const href = `/models/${encodeURIComponent(String(model.id))}`;
  const img = model.imageUrl || 'https://placehold.co/800x500?text=Guitar';

  return (
    <motion.article
      variants={cardVariants}
      className={[
        'relative group rounded-2xl border bg-white text-neutral-800',
        'border-black/10 shadow-sm transition-all',
        isSelected ? 'ring-2 ring-yellow-400 shadow-md' : 'hover:shadow-md',
      ].join(' ')}
    >
      {/* Selection toggle (prevents navigation) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle();
        }}
        aria-pressed={isSelected}
        aria-label={isSelected ? 'Deselect model' : 'Select model'}
        className={[
          'absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm',
          isSelected
            ? 'bg-yellow-400 text-black border-yellow-500'
            : 'bg-white/90 text-neutral-600 border-black/10',
          'shadow ring-0 focus:outline-none focus:ring-2 focus:ring-yellow-400',
        ].join(' ')}
      >
        {isSelected ? (
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M9 4a1 1 0 112 0v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4z" />
          </svg>
        )}
      </button>

      {/* Clickable content */}
      <Link href={href} className="block" aria-label={`Open ${model.name}`}>
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden bg-black/5">
          <motion.img
            src={img}
            alt={model.name}
            loading="lazy"
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.25 }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold leading-tight text-neutral-900">{model.name}</h3>
            {model.type && (
              <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full border border-yellow-500/40 text-yellow-700 bg-yellow-50">
                {model.type}
              </span>
            )}
          </div>

          <div className="mt-2 text-sm flex items-center gap-3 text-neutral-500">
            <span>{formatPriceEUR(model.price)}</span>
            <span className="opacity-40">•</span>
            <span>{model.year ?? '—'}</span>
          </div>

          {model.description && (
            <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{model.description}</p>
          )}
        </div>
      </Link>

      {/* Soft highlight */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/10 via-transparent to-transparent blur-2xl" />
        <div
          className={[
            'absolute inset-0 rounded-2xl',
            isSelected ? 'ring-1 ring-yellow-400/40' : 'ring-1 ring-black/10',
          ].join(' ')}
        />
      </div>
    </motion.article>
  );
}
