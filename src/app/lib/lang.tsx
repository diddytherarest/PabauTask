// src/app/lib/lang.tsx
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type LangCode = 'en' | 'mk' | 'sq';
type Dict = Record<string, string>;
type Messages = Record<LangCode, Dict>;

const MESSAGES: Messages = {
  en: {
    guitar_brands: 'Guitar Brands',
    tagline_lead: 'Plug in. Turn up.',
    tagline_highlight: 'Find your next favorite.',
    guitars: 'Guitars',
    guitar: 'Guitar',
    by: 'by',
    brand_id: 'Brand ID',
    all_brands: 'All brands',
    search: 'Search',
    type: 'Type',
    all_types: 'All types',
    price_range_eur: 'Price range (€)',
    min_eur: 'Min €',
    max_eur: 'Max €',
    sort: 'Sort',
    relevance: 'Relevance',
    name_asc: 'Name ↑',
    name_desc: 'Name ↓',
    price_asc: 'Price ↑',
    price_desc: 'Price ↓',
    no_results: 'No results.',
    error: 'Error',
    loading: 'Loading',
    try_again: 'Try again',
    shop_by_brand: 'Shop by {brand}',
    handpicked_models: 'Handpicked models',
    explore: 'Explore',
    language: 'Language',
    english: 'English',
    macedonian: 'Macedonian',
    albanian: 'Albanian',
    // Details page
    back_to_models: 'Back to models',
    specs: 'Specs',
    musicians: 'Musicians',
    body: 'Body',
    neck: 'Neck',
    scale_length: 'Scale length',
    pickups: 'Pickups',
    strings: 'Strings',
    year: 'Year',
    price: 'Price',
    show_two_more: 'Show 2 more',
    back_to_start: 'Back to start',
    no_musicians: 'No musicians listed.',
  },
  mk: {
    guitar_brands: 'Гитарски брендови',
    tagline_lead: 'Вклучи. Засили.',
    tagline_highlight: 'Пронајди го следниот омилен.',
    guitars: 'Гитари',
    guitar: 'Гитара',
    by: 'од',
    brand_id: 'ID на бренд',
    all_brands: 'Сите брендови',
    search: 'Пребарај',
    type: 'Тип',
    all_types: 'Сите типови',
    price_range_eur: 'Опсег на цена (€)',
    min_eur: 'Мин €',
    max_eur: 'Макс €',
    sort: 'Подреди',
    relevance: 'Релевантност',
    name_asc: 'Име ↑',
    name_desc: 'Име ↓',
    price_asc: 'Цена ↑',
    price_desc: 'Цена ↓',
    no_results: 'Нема резултати.',
    error: 'Грешка',
    loading: 'Вчитување',
    try_again: 'Обиди се повторно',
    shop_by_brand: 'Купувај од {brand}',
    handpicked_models: 'Избрани модели',
    explore: 'Истражи',
    language: 'Јазик',
    english: 'Англиски',
    macedonian: 'Македонски',
    albanian: 'Албански',
    back_to_models: 'Назад кон моделите',
    specs: 'Спецификации',
    musicians: 'Музичари',
    body: 'Куќиште',
    neck: 'Врат',
    scale_length: 'Скала',
    pickups: 'Пикап(и)',
    strings: 'Жици',
    year: 'Година',
    price: 'Цена',
    show_two_more: 'Покажи уште 2',
    back_to_start: 'Назад на почеток',
    no_musicians: 'Нема наведени музичари.',
  },
  sq: {
    guitar_brands: 'Marka të Kitarave',
    tagline_lead: 'Lidheje. Rrite volumin.',
    tagline_highlight: 'Gjej të preferuarën tënde.',
    guitars: 'Kitara',
    guitar: 'Kitara',
    by: 'nga',
    brand_id: 'ID e markës',
    all_brands: 'Të gjitha markat',
    search: 'Kërko',
    type: 'Lloj',
    all_types: 'Të gjitha llojet',
    price_range_eur: 'Shtrirja e çmimit (€)',
    min_eur: 'Min €',
    max_eur: 'Maks €',
    sort: 'Rendit',
    relevance: 'Rëndësia',
    name_asc: 'Emri ↑',
    name_desc: 'Emri ↓',
    price_asc: 'Çmimi ↑',
    price_desc: 'Çmimi ↓',
    no_results: 'Nuk ka rezultate.',
    error: 'Gabim',
    loading: 'Duke u ngarkuar',
    try_again: 'Provo përsëri',
    shop_by_brand: 'Bli nga {brand}',
    handpicked_models: 'Modele të përzgjedhura',
    explore: 'Eksploro',
    language: 'Gjuha',
    english: 'Anglisht',
    macedonian: 'Maqedonisht',
    albanian: 'Shqip',
    back_to_models: 'Kthehu te modelet',
    specs: 'Specifikat',
    musicians: 'Muzikantët',
    body: 'Trupi',
    neck: 'Qafa',
    scale_length: 'Gjatësia e skalës',
    pickups: 'Pickups',
    strings: 'Teli',
    year: 'Viti',
    price: 'Çmimi',
    show_two_more: 'Shfaq edhe 2',
    back_to_start: 'Kthehu në fillim',
    no_musicians: 'Nuk ka muzikantë.',
  },
};

type I18nContextType = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dict: Dict;
};

const LangContext = createContext<I18nContextType | null>(null);
const LS_KEY = 'app.lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY) as LangCode | null;
      if (saved && (saved === 'en' || saved === 'mk' || saved === 'sq')) {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {}
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    try { localStorage.setItem(LS_KEY, l); } catch {}
    try { document.documentElement.lang = l; } catch {}
  };

  const dict = useMemo(() => MESSAGES[lang], [lang]);
  const t = (key: string, params?: Record<string, string | number>) => {
    const template = dict[key] ?? key;
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
  };

  const value = useMemo(() => ({ lang, setLang, t, dict }), [lang, dict]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n must be used within <LanguageProvider>');
  return ctx;
}
