// src/app/components/BrandCard.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/lang';

type Brand = {
  id: string | number;
  name: string;
  imageUrl?: string | null;
};

const BRAND_IMAGES: Record<string, string> = {
  fender: '/Fender.jpg',
  gibson: '/Gibson.jpg',
  prs: '/PRS.jpg',
  martin: '/Martin.jpg',
  yamaha: '/Yamaha.jpg',
  gretsch: '/Gretsch.jpg',
  epiphone: '/Epiphone.jpg',
  ibanez: '/Ibanez.jpg',
  jackson: '/Jackson.jpg',
  'music man': '/MusicMan.jpg',
  musicman: '/MusicMan.jpg',
};

function imageForBrand(name: string, fallback?: string | null): string {
  const key = name.trim().toLowerCase();
  return BRAND_IMAGES[key] || fallback || '/file.svg';
}

export default function BrandCard({ brand }: { brand: Brand }) {
  const { t } = useI18n();
  const src = imageForBrand(brand.name, brand.imageUrl);

  return (
    <motion.article
      className="relative group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 overflow-hidden"
      initial={{ y: 0, scale: 1, opacity: 1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/20 via-transparent to-transparent blur-2xl" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-yellow-400/20" />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <span className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition" />
          <div className="relative h-16 w-16 rounded-full ring-2 ring-yellow-400/80 bg-black/50 overflow-hidden">
            <Image src={src} alt={brand.name} fill sizes="64px" className="object-cover" />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold leading-tight">{brand.name}</h3>
          <p className="text-xs text-neutral-400">{t('shop_by_brand', { brand: brand.name })}</p>
        </div>
      </div>

      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent opacity-60" />
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/80" />
          {t('handpicked_models')}
        </span>
        <span className="opacity-70 group-hover:opacity-100 transition">{t('explore')} →</span>
      </div>
    </motion.article>
  );
}
