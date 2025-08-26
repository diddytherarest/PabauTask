'use client';

type Model = {
  id: string;
  name: string;
  type?: string | null;
  price?: number | null;
  imageUrl?: string | null;
};

export default function ModelCard({ model }: { model: Model }) {
  return (
    <article className="border rounded-lg p-4 bg-white dark:bg-zinc-900 hover:shadow-md transition">
      <div className="h-32 flex items-center justify-center">
        {model.imageUrl ? (
          
          <img src={model.imageUrl} alt={model.name} className="max-h-32 object-contain" />
        ) : (
          <div className="h-20 w-20 rounded bg-black/5 dark:bg-white/10" />
        )}
      </div>
      <h2 className="mt-3 font-semibold">{model.name}</h2>
      {model.type && <p className="text-sm text-zinc-600">{model.type}</p>}
      {model.price != null && (
        <p className="text-sm font-medium text-indigo-600 mt-1">${model.price}</p>
      )}
    </article>
  );
}
