'use client';

import React from 'react';

/** One shimmering placeholder card (same footprint as ModelCard) */
export default function SkeletonCard() {
  return (
    <article className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/5 overflow-hidden">
      {/* Image block */}
      <div
        className="aspect-[16/10]"
        style={shimmerStyle}
        aria-hidden
      />

      {/* Text lines */}
      <div className="p-4 space-y-2">
        <div style={lineStyle(70)} />
        <div style={lineStyle(48)} />
        <div style={lineStyle(38)} />
      </div>
    </article>
  );
}

/** Grid of placeholders. Use while loading OR when list is empty. */
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <>
      {/* keyframes injected once wherever this is rendered */}
      <style jsx global>{`
        @keyframes skeletonShimmer {
          0%   { background-position: -150% 0; }
          100% { background-position: 150% 0; }
        }
      `}</style>

      <ul
        className="models-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <li key={i}>
            <SkeletonCard />
          </li>
        ))}
      </ul>
    </>
  );
}

/* -------- styles (inline, no external CSS needed) -------- */

const shimmerBg =
  'linear-gradient(90deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,.18) 40%, rgba(255,255,255,.06) 80%)';

const shimmerStyle: React.CSSProperties = {
  background: shimmerBg,
  backgroundSize: '200% 100%',
  animation: 'skeletonShimmer 1.1s linear infinite',
  borderBottom: '1px solid rgba(255,255,255,.06)',
};

const lineStyle = (wPct: number): React.CSSProperties => ({
  width: `${wPct}%`,
  height: 10,
  borderRadius: 8,
  background: shimmerBg,
  backgroundSize: '200% 100%',
  animation: 'skeletonShimmer 1.1s linear infinite',
  opacity: 0.7,
});
