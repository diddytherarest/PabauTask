'use client';

type Brand = {
  id: string;
  name: string;
  logoUrl?: string | null;
};

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <article
      className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 transition
                 hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500"
      aria-label={brand.name}
      tabIndex={-1}
    >
      <div className="h-20 flex items-center justify-center">
        {brand.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoUrl}
            alt={`${brand.name} logo`}
            className="max-h-20 max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div
            className="h-14 w-14 rounded-full bg-black/5 dark:bg-white/10"
            aria-hidden
          />
        )}
      </div>

      <div
        className="mt-3 text-center font-semibold text-zinc-900 dark:text-zinc-100
                   line-clamp-1"
      >
        {brand.name}
      </div>
      
      <div className="sr-only">{brand.name}</div>
    </article>
  );
}
