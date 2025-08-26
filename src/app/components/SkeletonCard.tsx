'use client';

export default function SkeletonCard() {
  return (
    <div className="animate-pulse border rounded-lg p-4 bg-white dark:bg-zinc-900">
      <div className="h-24 bg-black/5 dark:bg-white/10 rounded mb-4" />
      <div className="h-4 bg-black/5 dark:bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-4 bg-black/5 dark:bg-white/10 rounded w-1/2" />
    </div>
  );
}
