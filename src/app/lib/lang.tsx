'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'mk' | 'sq';

type Dict = Record<string, string>;
type I18nDict = Record<Lang, Dict>;

const DICT: I18nDict = {
  en: {
    guitar_brands: 'Guitar Brands',
    loading_brands: 'Loading brands…',
    loading_models: 'Loading models…',
    loading_guitar: 'Loading guitar…',
    error: 'Error',
    no_brands: 'No brands found.',
    no_models: 'No models found.',
    no_specs: 'No specs available.',
    no_musicians: 'No musicians listed for this guitar.',
    models_for_brand: 'Models for Brand',
    back: 'Back',
    back_to_brands: 'Back to brands',
    search_models: 'Search models…',
    all_types: 'All types',
    acoustic: 'Acoustic',
    electric: 'Electric',
    bass: 'Bass',
    specs: 'Specs',
    musicians: 'Musicians',
    price: 'Price',
    year: 'Year',
    brand: 'Brand',
    show_2_more: 'Show 2 more',
  },
  mk: {
    guitar_brands: 'Гитарски брендови',
    loading_brands: 'Се вчитуваат брендови…',
    loading_models: 'Се вчитуваат модели…',
    loading_guitar: 'Се вчитува гитара…',
    error: 'Грешка',
    no_brands: 'Нема пронајдени брендови.',
    no_models: 'Нема пронајдени модели.',
    no_specs: 'Нема спецификации.',
    no_musicians: 'Нема музичари за оваа гитара.',
    models_for_brand: 'Модели за бренд',
    back: 'Назад',
    back_to_brands: 'Назад кон брендовите',
    search_models: 'Пребарај модели…',
    all_types: 'Сите типови',
    acoustic: 'Акустична',
    electric: 'Електрична',
    bass: 'Бас',
    specs: 'Спецификации',
    musicians: 'Музичари',
    price: 'Цена',
    year: 'Година',
    brand: 'Бренд',
    show_2_more: 'Прикажи уште 2',
  },
  sq: {
    guitar_brands: 'Markat e kitarave',
    loading_brands: 'Duke ngarkuar markat…',
    loading_models: 'Duke ngarkuar modelet…',
    loading_guitar: 'Duke ngarkuar kitarën…',
    error: 'Gabim',
    no_brands: 'Nuk u gjetën marka.',
    no_models: 'Nuk u gjetën modele.',
    no_specs: 'Nuk ka specifikime.',
    no_musicians: 'Nuk ka muzikantë për këtë kitarë.',
    models_for_brand: 'Modele për markën',
    back: 'Kthehu',
    back_to_brands: 'Kthehu te markat',
    search_models: 'Kërko modele…',
    all_types: 'Të gjitha llojet',
    acoustic: 'Akustike',
    electric: 'Elektrike',
    bass: 'Bas',
    specs: 'Specifikime',
    musicians: 'Muzikantë',
    price: 'Çmimi',
    year: 'Viti',
    brand: 'Marka',
    show_2_more: 'Shfaq edhe 2',
  },
};

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Dict) => string;
};

const LangContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  // Load saved language on mount
  useEffect(() => {
    const saved = window.localStorage.getItem('lang');
    if (saved === 'en' || saved === 'mk' || saved === 'sq') {
      setLang(saved as Lang);
    }
  }, []);

  // Save to localStorage when it changes
  useEffect(() => {
    window.localStorage.setItem('lang', lang);
  }, [lang]);

  const value = useMemo<LangCtx>(() => {
    const t = (key: string) => DICT[lang][key] ?? key;
    return { lang, setLang, t };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n must be used within <LanguageProvider>');
  return ctx;
}
