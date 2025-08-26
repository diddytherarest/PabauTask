'use client';

import { useI18n } from './../lib/lang'; 

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="lang" className="opacity-70">Language:</label>
      <select
        id="lang"
        value={lang}
        onChange={(e) => setLang(e.target.value as any)}
        className="border rounded px-2 py-1"
      >
        <option value="en">English</option>
        <option value="mk">Македонски</option>
        <option value="sq">Shqip</option>
      </select>
    </div>
  );
}
