'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="p-8">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-red-600">{error.message}</p>
        <button onClick={reset} className="mt-4 px-4 py-2 border rounded">Try again</button>
      </body>
    </html>
  );
}
