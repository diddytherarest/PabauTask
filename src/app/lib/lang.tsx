// src/app/lib/lang.tsx
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type LangCode = 'en' | 'mk' | 'sq';

type Dict = Record<string, string>;

type Messages = Record<LangCode, Dict>;

const MESSAGES: Messages = {
  en: {
    // Global / headers
    guitar_brands: 'Guitar Brands',
    tagline_lead: 'Plug in. Turn up.',
    tagline_highlight: 'Find your next favorite.',
    guitars: 'Guitars',
    brand_id: 'Brand ID',
    all_brands: 'All brands',
    // Controls
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
    // States
    no_results: 'No results.',
    error: 'Error',
    try_again: 'Try again',
    // Cards
    shop_by_brand: 'Shop by {brand}',
    handpicked_models: 'Handpicked models',
    explore: 'Explore',
    // Footer / switcher
    language: 'Language',
    english: 'English',
    macedonian: 'Macedonian',
    albanian: 'Albanian',
  },
  mk: {
    guitar_brands: 'Гитарски брендови',
    tagline_lead: 'Вклучи. Засили.',
    tagline_highlight: 'Пронајди го следниот омилен.',
    guitars: 'Гитари',
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
    try_again: 'Обиди се повторно',
    shop_by_brand: 'Купувај од {brand}',
    handpicked_models: 'Избрани модели',
    explore: 'Истражи',
    language: 'Јазик',
    english: 'Англиски',
    macedonian: 'Македонски',
    albanian: 'Албански',
  },
  sq: {
    guitar_brands: 'Marka të Kitarave',
    tagline_lead: 'Lidheje. Rrite volumin.',
    tagline_highlight: 'Gjej të preferuarën tënde.',
    guitars: 'Kitara',
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
    try_again: 'Provo përsëri',
    shop_by_brand: 'Bli nga {brand}',
    handpicked_models: 'Modele të përzgjedhura',
    explore: 'Eksploro',
    language: 'Gjuha',
    english: 'Anglisht',
    macedonian: 'Maqedonisht',
    albanian: 'Shqip',
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

  // Load from localStorage on mount
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
    try {
      localStorage.setItem(LS_KEY, l);
    } catch {}
    try {
      document.documentElement.lang = l;
    } catch {}
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
