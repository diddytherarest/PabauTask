'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type Lang = 'en' | 'de' | 'sq' | 'mk';

type Dict = Record<string, string>;
type Dictionaries = Record<Lang, Dict>;

const dictionaries: Dictionaries = {
  en: {
    guitar_brands: 'Guitar Brands',
    loading: 'Loading…',
    no_results: 'No results.',
    error: 'Error',
    language: 'Language',
  },
  de: {
    guitar_brands: 'Gitarrenmarken',
    loading: 'Laden…',
    no_results: 'Keine Ergebnisse.',
    error: 'Fehler',
    language: 'Sprache',
  },
  sq: {
    guitar_brands: 'Markat e Kitarave',
    loading: 'Duke u ngarkuar…',
    no_results: 'Nuk ka rezultate.',
    error: 'Gabim',
    language: 'Gjuha',
  },
  mk: {
    guitar_brands: 'Гитарски Брендови',
    loading: 'Се вчитува…',
    no_results: 'Нема резултати.',
    error: 'Грешка',
    language: 'Јазик',
  },
};

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dictionaries['en']) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // default to English; you can hydrate from localStorage if you want
  const [lang, setLang] = useState<Lang>('en');

  const value = useMemo<LangContextValue>(() => {
    const dict = dictionaries[lang] ?? dictionaries.en;
    const t = (key: keyof typeof dictionaries['en']) => dict[key] ?? String(key);
    return { lang, setLang, t };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n must be used within <LanguageProvider>');
  return ctx;
}
