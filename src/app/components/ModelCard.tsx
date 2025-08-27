'use client';

import Link from 'next/link';
import React from 'react';

export type Model = {
  id: string | number;
  name: string;
  type?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  year?: number | null;
  // If your API already has a description, we’ll use it:
  description?: string | null;
};

function formatPrice(p?: number | null) {
  if (typeof p !== 'number') return 'Price on request';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
      p
    );
  } catch {
    return `€${p}`;
  }
}

function makeBlurb(m: Model) {
  // Prefer a real description if present
  if (m.description && m.description.trim().length > 0) return m.description;

  const bits: string[] = [];
  if (m.type) bits.push(m.type);
  if (typeof m.year === 'number') bits.push(String(m.year));
  if (typeof m.price === 'number') bits.push(formatPrice(m.price));
  return bits.length ? bits.join(' • ') : 'Beautiful tone, built to last.';
}

export default function ModelCard({ model }: { model: Model }) {
  const href = `/models/${String(model.id)}`;

  return (
    <article className="relative group overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur">
      {/* Make the whole card clickable */}
      <Link href={href} className="absolute inset-0" aria-label={`Open ${model.name}`} />

      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden bg-black/5 dark:bg-white/10">
        <img
          src={model.imageUrl || 'https://placehold.co/800x500?text=Guitar'}
          alt={model.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight">{model.name}</h3>
          {model.type && (
            <span className="shrink-0 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10">
              {model.type}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">{makeBlurb(model)}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">{formatPrice(model.price)}</span>
          <span className="text-xs text-neutral-500">View details →</span>
        </div>
      </div>

      {/* Hover ring */}
      <div className="pointer-events-none absolute inset-0 ring-0 ring-black/0 group-hover:ring-2 group-hover:ring-black/10 group-hover:dark:ring-white/10 transition" />
    </article>
  );
}
