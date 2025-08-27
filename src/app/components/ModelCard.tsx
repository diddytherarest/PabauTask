'use client';

import React from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

export type Model = {
  id: string | number;
  name: string;
  type?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  year?: number | null;
  description?: string | null;
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

function makeBlurb(m: Model) {
  if (m.description && m.description.trim()) return m.description;
  const bits: string[] = [];
  if (m.type) bits.push(m.type);
  if (typeof m.year === 'number') bits.push(String(m.year));
  if (typeof m.price === 'number') bits.push(formatPrice(m.price));
  return bits.length ? bits.join(' • ') : 'Beautiful tone, built to last.';
}

// Use a typed bezier for 'ease' to satisfy TS
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: EASE },
  },
};

export default function ModelCard({ model }: { model: Model }) {
  const href = `/models/${String(model.id)}`;

  return (
    <Link href={href} className="group block no-underline" aria-label={`Open ${model.name}`}>
      <motion.article
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.18 } }} // keep simple to avoid TS fuss
        className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm hover:shadow-lg transition-shadow"
      >
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden bg-black/5 dark:bg-white/10">
          <motion.img
            src={model.imageUrl || 'https://placehold.co/800x500?text=Guitar'}
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
            <h3 className="font-semibold leading-tight">{model.name}</h3>
            {model.type && (
              <span className="shrink-0 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10">
                {model.type}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
            {makeBlurb(model)}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold">{formatPrice(model.price)}</span>
            <span className="text-xs text-neutral-500">View details →</span>
          </div>
        </div>

        {/* Subtle hover ring */}
        <div className="pointer-events-none absolute inset-0 ring-0 ring-black/0 group-hover:ring-2 group-hover:ring-black/10 group-hover:dark:ring-white/10 transition" />
      </motion.article>
    </Link>
  );
}
