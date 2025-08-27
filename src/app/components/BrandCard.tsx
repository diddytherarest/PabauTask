'use client';

type Brand = {
  id: string;
  name: string;
  logoUrl?: string | null;
};

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <article
      className="brand-card p-4 transition focus-within:ring-2 focus-within:ring-indigo-500"
      aria-label={brand.name}
      tabIndex={-1}
    >
      <div className="h-20 flex items-center justify-center">
        {(() => {
          const brandImages: Record<string, string> = {
            'Fender': '/Fender.jpg',
            'Ibanez': '/Ibanez.jpg',
            'Gibson': '/Gibson.jpg',
            'PRS': '/PRS.jpg',
            'Martin': '/Martin.jpg',
            'Yamaha': '/Yamaha.jpg',
            'Gretsch': '/Gretsch.jpg',
            'Epiphone': '/Epiphone.jpg',
            'Jackson': '/Jackson.jpg',
            'Music Man': '/MusicMan.jpg',
          };
          const imgSrc = brandImages[brand.name];
          if (imgSrc) {
            return (
              <img
                src={imgSrc}
                alt={`${brand.name} logo`}
                className="h-16 w-16 object-contain rounded-full border-4 border-yellow-400 shadow-lg bg-white"
                style={{ background: 'radial-gradient(circle, #fff 60%, #ffd700 100%)' }}
                loading="lazy"
              />
            );
          } else if (brand.logoUrl) {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logoUrl}
                alt={`${brand.name} logo`}
                className="max-h-20 max-w-full object-contain"
                loading="lazy"
              />
            );
          } else {
            return (
              <div
                className="h-14 w-14 rounded-full bg-black/5 dark:bg-white/10"
                aria-hidden
              />
            );
          }
        })()}
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
