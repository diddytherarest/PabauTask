// src/app/components/LanguageSwitcher.tsx
'use client';

import { useI18n, LangCode } from '../lib/lang';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="opacity-70">{t('language')}:</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as LangCode)}
        className="h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-3"
      >
        <option value="en">{t('english')}</option>
        <option value="mk">{t('macedonian')}</option>
        <option value="sq">{t('albanian')}</option>
      </select>
    </div>
  );
}
